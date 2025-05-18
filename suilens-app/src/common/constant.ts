export const PAGE_ROUTES = {
    HOME: '/home',
    DASHBOARD: '/dashboard',
    QUERY_EDITOR: '/query-editor'
}

// imports

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
