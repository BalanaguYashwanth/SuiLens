import axios from 'axios';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateNonce, generateRandomness, getExtendedEphemeralPublicKey } from '@mysten/sui/zklogin';
import { jwtToAddress } from '@mysten/sui/zklogin';
import { genAddressSeed, getZkLoginSignature } from "@mysten/sui/zklogin";
import { jwtDecode } from "jwt-decode";
import { SUI_ZKLOGIN } from "../constant";
import { SUI_CLIENT } from "../helpers";
import { authenticateUser, createUser } from "../api.services";

export class AuthService {

    static getAddressSeed() {
        const jwt = AuthService.decodeJwt();
        const salt = AuthService.salt();
        return genAddressSeed(BigInt(salt!), "sub", jwt.sub as string, jwt.aud?.toString() || '').toString();
    }

    static getEd25519Keypair(): Ed25519Keypair {
        const jwtData = AuthService.getJwtData();
        const publicKey = new Uint8Array(Object.values(jwtData.ephemeralKeyPair.keypair.publicKey));
        const secretKey = new Uint8Array(Object.values(jwtData.ephemeralKeyPair.keypair.secretKey));
        return new Ed25519Keypair({ publicKey, secretKey })
    }

    static async getPartialZkLoginSignature(): Promise<any> {
        const keyPair = AuthService.getEd25519Keypair();
        const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(keyPair.getPublicKey());
        const verificationPayload = {
            jwt: AuthService.jwt(),
            extendedEphemeralPublicKey,
            maxEpoch: this.getMaxEpoch(),
            jwtRandomness: this.getRandomness(),
            salt: AuthService.salt(),
            keyClaimName: "sub"
        };
        return await AuthService.verifyPartialZkLoginSignature(verificationPayload);
    }

    private static async verifyPartialZkLoginSignature(zkpRequestPayload: any) {
        try {
            const proofResponse = await fetch(SUI_ZKLOGIN.PROVER_URL as string, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(zkpRequestPayload)
            });
            const proofResponseData = await proofResponse.json();
            const partialZkLoginSignature = proofResponseData.data as PartialZkLoginSignature;
            return partialZkLoginSignature;
        } catch (error) {
            console.log("failed to reqeust the partial sig: ", error);
            return {};
        }
    }

    static async generateZkLoginSignature(userSignature: string): Promise<any> {
        const partialZkLoginSignature = await AuthService.getPartialZkLoginSignature();
        const addressSeed = AuthService.getAddressSeed();
        const maxEpoch = AuthService.getMaxEpoch();
        return getZkLoginSignature({
            inputs: {
                ...partialZkLoginSignature,
                addressSeed
            },
            maxEpoch,
            userSignature,
        });
    }

    static getMaxEpoch() {
        return AuthService.getJwtData().maxEpoch;
    }

    static getRandomness() {
        return AuthService.getJwtData().randomness;
    }
    private static getJwtData() {
        const jwtData = sessionStorage.getItem("jwt_data");
        if (!jwtData) {
            throw new Error('JWT data not found in session storage');
        }
        return JSON.parse(jwtData);
    }

    private static decodeJwt(): JwtPayload {
        const jwt = sessionStorage.getItem('sui_jwt_token');
        if (!jwt) {
            throw new Error('JWT token not found in session storage');
        }
        return jwtDecode(jwt) as JwtPayload;
    }

    private static salt() {
        const email = AuthService.claims()['email'];
        return AuthService.hashcode(email);
    }

    static walletAddress() {
        const email = AuthService.claims()['email'];
        return jwtToAddress(AuthService.jwt() as string, AuthService.hashcode(email));
    }

    private static claims() {
        const token = AuthService.jwt();
        if (token)
            return JSON.parse(atob(token.split('.')[1]));
    }

    private static hashcode(s: string) {
        var h = 0, l = s.length, i = 0;
        if (l > 0)
            while (i < l)
                h = (h << 5) - h + s.charCodeAt(i++) | 0;
        return h.toString();
    }

    static isAuthenticated() {
        const token = AuthService.jwt();
        return token && token !== 'null';
    }

    static jwt() {
        return sessionStorage.getItem("sui_jwt_token");
    }

    async login() {
        const { epoch } = await SUI_CLIENT.getLatestSuiSystemState();

        const maxEpoch = Number(epoch) + 2222;
        const ephemeralKeyPair = new Ed25519Keypair();
        const randomness = generateRandomness();
        const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);
        const jwtData = {
            maxEpoch,
            nonce,
            randomness,
            ephemeralKeyPair,
        };
        sessionStorage.setItem("jwt_data", JSON.stringify(jwtData));
        const params = new URLSearchParams({
            client_id: SUI_ZKLOGIN.CLIENT_ID as string,
            redirect_uri: SUI_ZKLOGIN.REDIRECT_URL as string,
            response_type: 'id_token',
            scope: 'openid email',
            nonce: nonce,
        });

        try {
            const { data } = await axios.get(SUI_ZKLOGIN.OPENID_PROVIDER_URL as string);
            const authUrl = `${data.authorization_endpoint}?${params}`;
            window.location.href = authUrl;
        } catch (error) {
            console.error('Error initiating Google login:', error);
        }
    }

    static async finalizeLoginAndCreateUserIfNeeded() {
        const token = this.jwt();
        if (token) {
            try {
                await authenticateUser(token);

                const res = await createUser();
                console.log("User creation response:", res);
            } catch (err) {
                console.error("Failed to create user in DB:", err);
            }
        }
    }
}

export interface JwtPayload {
    iss?: string;
    sub?: string;
    aud?: string[] | string;
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
}

export type PartialZkLoginSignature = Omit<
    Parameters<typeof getZkLoginSignature>['0']['inputs'],
    'addressSeed'
>;
