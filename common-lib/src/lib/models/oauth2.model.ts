import { AuthConfig  } from "angular-oauth2-oidc";

export const INIT_OAUTH_MODEL: AuthConfig = {
    issuer: '',
    redirectUri: '',
    requireHttps: false,
    postLogoutRedirectUri: '',
    clientId: '',
    responseType: '',
    scope: '',
    showDebugInformation: false,
    strictDiscoveryDocumentValidation: false,
    dummyClientSecret: '',
    tokenEndpoint: '',
    useSilentRefresh: '',
    timeoutFactor: 0,
    silentRefreshRedirectUri: ''
};
