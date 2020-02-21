import dateService from './date.service';
import { Typography } from '@material-ui/core';

class Pages {
    static _instance: Pages;

    constructor() {

    }

    sortPages(pages: any){
        pages.sort((page1: any, page2: any) => {
            if(page1.sessions.length === 0 && page2.sessions.length > 0){
                return 1;
            }else if(page1.sessions.length > 0 && page2.sessions.length === 0){
                return -1;
            }else if(page1.sessions.length === 0 && page2.sessions.length === 0){
                return 0;
            }else{
                const _date1: any = new Date(page1.sessions[0].startDate);
                const _date2: any = new Date(page2.sessions[0].startDate);
                return _date2 - _date1
            }
        });
    }

    getSessionsFromDB(db: any){
        const pageTitleToSessions: any = {};

        db.forEach((row: any) => {
            if (!pageTitleToSessions[row.title]) {
                pageTitleToSessions[row.title] = [];
            }

            pageTitleToSessions[row.title].push(row);
        });

        return pageTitleToSessions;
    }

    addSessionDiffFromToday(sessions: any){
        return sessions.map((session: any) => {
            session.daysDiffFromToday = dateService.diffFromToday(session.startDate);
            return session;
        });
    }

    mergeDBAndPageData(db: any, pages: any) {
        const pageTitleToSessions: any = {};

        db.forEach((row: any) => {
            if (!pageTitleToSessions[row.title]) {
                pageTitleToSessions[row.title] = [];
            }

            pageTitleToSessions[row.title].push(row);
        });
        
        pages.forEach((page: any) => {
            page.sessions = pageTitleToSessions[page.title] || [];
            // Page details
            this.addSessionDiffFromToday(page.sessions);
        });

        this.sortPages(pages);
    }

    static getInstance() {
        if (!Pages._instance) {
            Pages._instance = new Pages();
        }

        return Pages._instance;
    }
}

export default Pages.getInstance();