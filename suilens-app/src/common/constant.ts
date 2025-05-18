export const PAGE_ROUTES = {
    HOME: '/home',
    DASHBOARD: '/dashboard',
    DEMO: '/demo',
    QUERY_EDITOR: '/query-editor',
}

const PROVER_URL = process.env.REACT_APP_PROVER_URL;
const REDIRECT_URL = process.env.REACT_APP_REDIRECT_URL;
const OPENID_PROVIDER_URL = process.env.REACT_APP_OPENID_PROVIDER_URL;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

export const SUI_ZKLOGIN = {
    PROVER_URL,
    REDIRECT_URL,
    OPENID_PROVIDER_URL,
    CLIENT_ID
}

export const FIREBASE_DB_API = process.env.REACT_APP_FIREBASE_DB_API
export const DEMO_NFT_PACKAGE_ID = process.env.REACT_APP_DEMO_NFT_PACKAGE_ID