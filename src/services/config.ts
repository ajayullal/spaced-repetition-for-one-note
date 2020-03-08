import * as Msal from 'msal';
import {routeConfig as r} from './route.service';

export const serverBase = 'http://localhost:3000';
//export const serverBase = 'https://ajayullal.github.io/one-note-spaced-repetition';

export const msalConfig: Msal.Configuration = {
    auth: {
        clientId: "7909dc21-ee19-4123-8ff2-9f21085c8447",
        authority: "https://login.microsoftonline.com/common",
        // redirectUri: `${serverBase}/auth`
        redirectUri: `${serverBase}/notebooks`
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true
    }
};

export const themeConfig = {
    drawerWidth: 240
};

export const apiConfig = {
    // serverBase: 'http://localhost:4006'
    serverBase: 'https://www.onenote.com/api/v1.0/me/notes'
};

export const appTexts = {
    appName: 'Spaced Repetition'
};

export const routeConfig = r;

export default {
    themeConfig,
    appTexts,
    apiConfig,
    msalConfig,
    routeConfig
}
