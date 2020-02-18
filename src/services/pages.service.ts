import dateService from './date.service';
import { Typography } from '@material-ui/core';

class Pages {
    static _instance: Pages;

    constructor() {

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
            page.sessions.forEach((session: any) => {
                session.daysDiffFromToday = dateService.diffFromToday(session.startDate);
            });
        });
    }

    static getInstance() {
        if (!Pages._instance) {
            Pages._instance = new Pages();
        }

        return Pages._instance;
    }
}

export default Pages.getInstance();