import { default as _axios } from 'axios';
import { msalConfig } from './config';
import * as Msal from 'msal';
import userService from './user.service';
import utilsService from './utils.service';
import clientStorage from "./client-side-data-storage.service";
import errorHandlerService from "./error-handler.service";
import routerService, { history } from './route.service';

const axios = _axios.create({
    baseURL: 'https://graph.microsoft.com/v1.0/me/onenote',
    headers: {

    }
});

axios.interceptors.response.use(response => response.data, error => Promise.reject(error));

const dbPageId = '0-f2f6afa638c1864cb26399b2a7cef5f7!1-E6AC34B29128DCBF!2176';

const apiEndPoints = {
    notebooks: '/notebooks',
    sections: '/notebooks/:id/sections',
    sectionPages: '/sections/:id/pages?top=100',
    content: `/pages/${dbPageId}/content`,
    pages: '/pages?top=100'
};

class MicrosoftOneNoteApi {
    private _redirectUrl: string | null = null;
    private _db: any;
    private _dbCellDelimiter = '!@#';

    public get redirectUrl(): string | null {
        return this._redirectUrl;
    }

    public set redirectUrl(value: string | null) {
        this._redirectUrl = value;
    }

    myMSALObj: any;
    static microsoftOneNoteApi: any;

    //, "Notes.ReadWrite.All", "Notes.ReadWrite", "Notes.Read", "Notes.Create"
    requestObj = {
        scopes: ["Notes.Read.All"],
        loginHint: null
    };

    constructor() {
        this.myMSALObj = new Msal.UserAgentApplication(msalConfig);
        this.checkAndSetPersistedBearerToken();
    }

    authRedirectCallBack(error: any, response: any) {
        if (error) {
            console.log(error);
        }
        else {
            if (response.tokenType === "access_token") {
                console.log(response.accessToken);
            } else {
                console.log("token type is:" + response.tokenType);
            }
        }
    }

    checkTokenExpiryAndRenew() {
        // Refresh every 1 minute
        setTimeout(this.acquireTokenPopup.bind(this, true), (1000 * 60));
    }

    onToken(tokenResponse: any, isRenewal: boolean) {
        clientStorage.setItemSync('tokenResponse', JSON.stringify(tokenResponse));
        this.setBearerToken(tokenResponse.accessToken);
        this.setUserDetails(userService.userDetails);

        if (!isRenewal) {
            history.push(routerService.getRouteUrl('notebooks'));
        }
    }

    acquireTokenPopup(isRenewal = false) {
        //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
        //loginHint: this.userName 
        let tokenResponse: any = clientStorage.getItemSync('tokenResponse');

        if (tokenResponse) {
            tokenResponse = JSON.parse(tokenResponse);
            this.requestObj.loginHint = tokenResponse.idToken.preferredName;
        }
        
        this.myMSALObj.acquireTokenSilent(this.requestObj).then((tokenResponse: any) => {
            this.onToken(tokenResponse, isRenewal);
            this.checkTokenExpiryAndRenew();
        }).catch((error: any) => {
            console.error(error);
            this.myMSALObj.acquireTokenPopup(this.requestObj).then((tokenResponse: any) => {
                this.onToken(tokenResponse, isRenewal);
                this.checkTokenExpiryAndRenew();
            }).catch((error: any) => {
                console.error(error);
            });
        });
    }

    setUserDetails(userDetails: any) {
        clientStorage.setItemSync('userDetails', JSON.stringify(userDetails));
    }

    onSignIn() {
        this.myMSALObj.handleRedirectCallback(this.authRedirectCallBack);

        return this.myMSALObj.loginPopup(this.requestObj).then((loginResponse: any) => {
            this.acquireTokenPopup();
        }).catch((error: any) => {
            alert(error);
        });
    }

    checkAndSetPersistedBearerToken() {
        const token = clientStorage.getItemSync('token');

        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }

    setBearerToken(token: string) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        clientStorage.setItemSync('token', token);
    }

    private returnValue(resp: any) {
        return resp.value
    }

    getAllNoteBooks() {
        return axios.get(apiEndPoints.notebooks).then(this.returnValue).catch(errorHandlerService.handleError);
    }

    getAllSection(notebookId: string) {
        return axios.get(utilsService.replaceParamsInUrl(apiEndPoints.sections, { id: notebookId })).then(this.returnValue).catch(errorHandlerService.handleError);
    }

    getAllPages() {
        return axios.get(apiEndPoints.pages).then((response: any) => {
            return response.value.filter((page: any) => page.id !== dbPageId && page.parentSection.displayName !== "Work");
        }).catch(errorHandlerService.handleError);
    }

    getSectionPages(sectionId: string) {
        return axios.get(utilsService.replaceParamsInUrl(apiEndPoints.sectionPages, { id: sectionId })).then(response => {
            const _response = this.returnValue(response);
            return _response.filter((page: any) => page.title);
        }).catch(errorHandlerService.handleError);
    }

    getPage(selfUrl: string) {
        return axios.get(selfUrl).catch(errorHandlerService.handleError);
    }

    updateOneNoteDB(sessionDetails: any) {
        let content = JSON.stringify(sessionDetails);

        return axios.patch(apiEndPoints.content,
            [
                {
                    'target': 'body',
                    'action': 'append',
                    'content': `<p>${content}</p>`
                }
            ]
        ).then(data => this._db = null).catch(errorHandlerService.handleError);
    }

    getAllDBRows() {
        return new Promise((resolve, reject) => {
            this.getDb().then((db: string) => {
                var doc = new DOMParser().parseFromString(db, "text/xml");
                const ps = Array.from(doc.getElementsByTagName('p'));
                const _rows: any[] = [];
                ps.forEach(p => {
                    const content = p?.textContent?.split(this._dbCellDelimiter)[0] || ''
                    _rows.push(JSON.parse(content));
                });
                resolve(_rows);
            }).catch(reject);
        });
    }

    getDb() {
        if (this._db) {
            return Promise.resolve(this._db);
        } else {
            return axios.get(apiEndPoints.content).then(db => {
                return this._db = db;
            }).catch(errorHandlerService.handleError);
        }
    }

    getPageContent(contentUrl: string) {
        return axios.get(contentUrl).catch(errorHandlerService.handleError);
    }

    static getInstance() {
        if (!MicrosoftOneNoteApi.microsoftOneNoteApi) {
            MicrosoftOneNoteApi.microsoftOneNoteApi = new MicrosoftOneNoteApi();
        }

        return MicrosoftOneNoteApi.microsoftOneNoteApi;
    }
}

export default MicrosoftOneNoteApi.getInstance();