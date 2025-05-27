// demo.tsx
import { useEffect, useState } from "react";
import { Transaction } from '@mysten/sui/transactions';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { ConnectButton, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { SuilensClient } from "suilens-sdk";
import { DEMO_NFT_PACKAGE_ID } from "../../common/constant";
import { deleteNFT, fetchNFT, recordNFT } from "../../common/api.services";
import './Demo.scss';

const suiClient = new SuiClient({
    url: getFullnodeUrl('testnet'),
});

const Demo = () => {
    const [nfts, setNfts] = useState<Array<{ keyId: string, nftId: string }>>([]);
    const { mutateAsync: signAndExecuteTransactionBlock } = useSignAndExecuteTransaction();
    const [nftDetails, setNftDetails] = useState({
        name: '',
        description: '',
        image_url: '',
        price: 0
    });
    const [txStatus, setTxStatus] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<Record<string, boolean>>({});
    const [burned, setBurned] = useState<Record<string, boolean>>({});
    const client = new SuilensClient();

    useEffect(() => {
        const initClient = async () => {
            await client.init({ dbName: 'hello_world', tableName: 'nftstatus' });
        };
        initClient();
    }, []);

    const toggleFavorite = async (nftId: string) => {
            const txb = new Transaction() as any;
            txb.setGasBudget(100000000);
            txb.moveCall({
                arguments: [
                    txb.object(nftId)
                ],
                target: `${DEMO_NFT_PACKAGE_ID}::diy_nft::favorite_nft`,
            });
            await signAndExecuteTransactionBlock({ transaction: txb });

            const client = new SuilensClient();
            await client.init({ dbName: 'hello_world', tableName: 'nftstatus' });
            await client.insert({ nftId, action: 'favorite', timestamp: Date.now() });
            setFavorites(prev => ({ ...prev, [nftId]: !prev[nftId] }));
        };

    const toggleBurn = async (nftId: string, keyId: string) => {
        try {
            const txb = new Transaction() as any;
            txb.setGasBudget(100_000_000);
            txb.moveCall({
                arguments: [
                    txb.object(nftId),
                ],
                target: `${DEMO_NFT_PACKAGE_ID}::diy_nft::burn`,
            });
            await signAndExecuteTransactionBlock({ transaction: txb });

            const client = new SuilensClient();
            await client.init({ dbName: 'hello_world', tableName: 'nftstatus' });
            await client.insert({ nftId, action: 'burn', timestamp: Date.now() });
            await deleteNFT(keyId)
            const filtered_nfts = nfts.filter(nft => nft.nftId !== nftId)
            setNfts([...filtered_nfts]);
        } catch (err) {
            console.error("Error burning NFT:", err);
        }
    };

    const createNFT = async () => {
        try {
            setTxStatus("Pending...");

            const txb = new Transaction() as any;
            txb.setGasBudget(100000000);
            txb.moveCall({
                arguments: [
                    txb.pure.string(nftDetails.name),
                    txb.pure.string(nftDetails.description),
                    txb.pure.string(nftDetails.image_url),
                    txb.pure.u64(nftDetails.price),
                ],
                target: `${DEMO_NFT_PACKAGE_ID}::diy_nft::mint_to_sender`,
            });

            const { digest } = await signAndExecuteTransactionBlock({ transaction: txb });

            const { effects } = await suiClient.waitForTransaction({
                digest,
                options: { showObjectChanges: true, showEffects: true },
            });

            if (effects?.created?.length && effects.status.status === 'success') {
                const nftObjectID = effects.created[0].reference.objectId;
                await recordNFT(nftObjectID);
                setTxStatus("Success! NFT Created.");
                const updated = await fetchNFT();
                const nftIDs: Array<{ keyId: string; nftId: string }> = Object.entries(updated).map(
                    ([keyId, value]: [string, any]) => ({
                      keyId,
                      nftId: value.nftID,
                    })
                  );
                setNfts(nftIDs);

            } else {
                setTxStatus("Failed to create NFT.");
            }
        } catch (err) {
            console.error("Transaction Error:", err);
            setTxStatus("Error occurred during transaction.");
        }
    };


    useEffect(() => {
        (async () => {
            const nftData = await fetchNFT();
            const formattedNFTs = Object.entries(nftData).map(([key, value]: [string, any]) => {
                return {
                    keyId: key,
                    nftId: value.nftID,
                };
            });

            setNfts(formattedNFTs);
        })();
    }, []);

    return (
        <main className="demo-container">
            <header className="demo-header">
                <ConnectButton />
            </header>

            <section className="create-section">
                <h2>Create NFT</h2>
                <div className="input-group">
                    <input placeholder="Enter name" onChange={e => setNftDetails({ ...nftDetails, name: e.target.value })} />
                    <input placeholder="Enter description" onChange={e => setNftDetails({ ...nftDetails, description: e.target.value })} />
                    <input placeholder="Enter image URL" onChange={e => setNftDetails({ ...nftDetails, image_url: e.target.value })} />
                    <input type="number" placeholder="Enter price" onChange={e => setNftDetails({ ...nftDetails, price: Number(e.target.value) })} />
                </div>
                <button className="submit-btn" onClick={createNFT}>Submit</button>
                {txStatus && <p className="status-msg">{txStatus}</p>}
            </section>

            <section className="nft-list">
                <h2>All NFTs</h2>
                <div className="nft-grid">
                    {nfts.map(({ nftId, keyId }, index) => (
                        <article key={`nft-${index}`} className="nft-card">
                            <img src={`https://placehold.co/150?text=NFT%20%23${index + 1}`} alt={`nft-${index}`} />
                            <p className="nft-id">{nftId}</p>
                            <div className="nft-actions">
                                <button
                                    className={`icon-btn ${favorites[nftId] ? 'active favorite' : ''}`}
                                    onClick={() => toggleFavorite(nftId)}
                                    title="Favorite"
                                >
                                    {favorites[nftId] ? '⭐' : '☆'}
                                </button>
                                <button
                                    className={`icon-btn ${burned[nftId] ? 'active burn' : ''}`}
                                    onClick={() => toggleBurn(nftId, keyId)}
                                    title="Burn"                    
                                >
                                    {burned[nftId] ? '🔥' : '🗯️'}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Demo;