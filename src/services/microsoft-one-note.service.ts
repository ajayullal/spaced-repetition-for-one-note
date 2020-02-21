import { default as _axios } from 'axios';
import { msalConfig } from './config';
import * as Msal from 'msal';
import userService from './user.service';
import utilsService from './utils.service';
import clientStorage from "./client-side-data-storage.service";
import errorHandlerService from "./error-handler.service";
import routerService from './route.service';

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

    onToken(tokenResponse: any){
        this.setBearerToken(tokenResponse.accessToken);
        this.setUserDetails(userService.userDetails);
        window.location.href = routerService.getRouteUrl('notebooks');
    }

    acquireTokenPopup() {
        //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
        this.myMSALObj.acquireTokenSilent(this.requestObj).then((tokenResponse: any) => {
            this.onToken(tokenResponse)
        }).catch((error: any) => {
            alert(error);
            this.myMSALObj.acquireTokenPopup(this.requestObj).then((tokenResponse: any) => {
                this.onToken(tokenResponse)
            }).catch((error: any) => {
                alert(error);
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

    getAllPages(sectionId: string) {
        return axios.get(utilsService.replaceParamsInUrl(apiEndPoints.pages, { id: sectionId })).then(response => {
            const _response = this.returnValue(response);
            return _response.filter((page: any) => page.title);
        }).catch(errorHandlerService.handleError);
    }

    getPage(selfUrl: string) {
        return axios.get(selfUrl).catch(errorHandlerService.handleError);
    }

    updateOneNotePage(sessionDetails: any) {
        const rowProperties = ['startDate', 
                               'startTime', 
                               'title', 
                               'minutesSpentLearning', 
                               'totalSessionMinutes', 
                               'repetition',
                               'pageId',
                               'sectionName',
                               'sectionId'];

        let content = '';

        rowProperties.forEach((rowProp, index) => {
            content += `${sessionDetails[rowProp]}${index !== (rowProperties.length - 1)? this._dbCellDelimiter: ''}`
        });

        return axios.patch(apiEndPoints.content,
            [
                {
                    'target':'body',
                    'action':'append',
                    'content': `<p>${content}</p>`
                  }
             ]
        ).then(data => this._db = null).catch(errorHandlerService.handleError);
    }

    getAllDBRows(){
        return new Promise((resolve, reject) => {
            this.getDb().then((db: string) => {
                var doc = new DOMParser().parseFromString(db, "text/xml");
                const ps = Array.from(doc.getElementsByTagName('p'));
                const _rows: any[] = [];
                ps.forEach(p => {
                  const content = p?.textContent?.split(this._dbCellDelimiter) || [];
                  _rows.push({
                    startDate: content ? content[0] : '',
                    startTime: content ? content[1] : '',
                    title: content ? content[2].trim() : '',
                    minutesSpentLearning: content ? Number(content[3]) : '',
                    totalSessionMinutes: content ? content[4] : '',
                    repetition: content ? (content[5].trim() === 'false'? 'No': 'Yes') : '',
                    pageId: content ? content[6] : '',
                    sectionName: content ? content[7] : '',
                    sectionId: content ? content[8] : ''
                  });
                });
                resolve(_rows);
              }).catch(reject);
        });
    }

    getDb(){
        if(this._db){
            return Promise.resolve(this._db);
        }else{
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