import { default as _axios } from 'axios';
import { msalConfig } from './config';
import * as Msal from 'msal';
import userService from './user.service';
import utilsService from './utils.service';
import clientStorage from "./client-side-data-storage.service";
import errorHandlerService from "./error-handler.service";

const axios = _axios.create({
    baseURL: 'https://graph.microsoft.com/v1.0/me/onenote',
    headers: {

    }
});

axios.interceptors.response.use(response => response.data, error => Promise.reject(error));

const apiEndPoints = {
    notebooks: '/notebooks',
    sections: '/notebooks/:id/sections',
    pages: '/sections/:id/pages?top=100',
    content: '/pages/0-f2f6afa638c1864cb26399b2a7cef5f7!1-E6AC34B29128DCBF!2176/content'
};

class MicrosoftOneNoteApi {
    private _redirectUrl: string | null = null;

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
        scopes: ["Notes.Read.All"]
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

    acquireTokenPopup() {
        //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
        this.myMSALObj.acquireTokenSilent(this.requestObj).then((tokenResponse: any) => {
            userService.userDetails = tokenResponse;
            this.setBearerToken(tokenResponse.accessToken);
            this.setUserDetails(userService.userDetails);
            window.location.href = '';
        }).catch((error: any) => {
            console.error(error);
            this.myMSALObj.acquireTokenPopup(this.requestObj).then((tokenResponse: any) => {
                this.setBearerToken(tokenResponse.accessToken);
            }).catch((error: any) => {
                console.log(error);
            });
        });
    }

    setUserDetails(userDetails: any) {
        clientStorage.setItemSync('userDetails', JSON.stringify(userDetails));
    }

    onSignIn() {
        // this.myMSALObj.handleRedirectCallback(this.authRedirectCallBack);
        return this.myMSALObj.loginPopup(this.requestObj).then((loginResponse: any) => {
            this.acquireTokenPopup();
        }).catch((error: any) => {
            console.log(error);
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

    getAllPages(sectionId: string) {
        return axios.get(utilsService.replaceParamsInUrl(apiEndPoints.pages, { id: sectionId })).then(this.returnValue).catch(errorHandlerService.handleError);
    }

    getPage(selfUrl: string) {
        return axios.get(selfUrl).catch(errorHandlerService.handleError);
    }

    updateOneNotePage(sessionDetails: any) {
        return axios.patch(apiEndPoints.content,
            [
                {
                    'target':'body',
                    'action':'append',
                    'content': `<p>${sessionDetails.startDate}, ${sessionDetails.startTime}, ${sessionDetails.title}, ${sessionDetails.minutesSpentLearning}, ${sessionDetails.totalSessionMinutes}</p>`
                  }
             ]
        ).catch(errorHandlerService.handleError);
    }

    getDb(){
        return axios.get(apiEndPoints.content)
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