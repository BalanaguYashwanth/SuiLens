"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = void 0;
const client_1 = require("@mysten/sui/client");
const clients = {
    mainnet: new client_1.SuiClient({ url: 'https://fullnode.mainnet.sui.io:443' }),
    testnet: new client_1.SuiClient({ url: 'https://fullnode.testnet.sui.io:443' }),
    devnet: new client_1.SuiClient({ url: 'https://fullnode.devnet.sui.io:443' }),
};
const getClient = (network) => {
    const client = clients[network.toLowerCase()];
    if (!client) {
        throw new Error(`Invalid network: ${network}`);
    }
    return client;
};
exports.getClient = getClient;
