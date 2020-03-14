import './_pages.module.scss';
import React, { useEffect, useState } from 'react';
import withAuth from '../../HOCs/withAuth';
import { TextField, LinearProgress } from '@material-ui/core';
import Layout from '../../components/layout/layout';
import routerService from '../../services/route.service';
import usePages from './usePages';
import PageList from '../../components/pagesList/pagesList';
import pagesService from '../../services/pages.service';
import useDb from '../../hooks/useDB';
import utilsService from '../../services/utils.service';

export default withAuth((props: any) => {
    const [pages, pagesLoading] = usePages();
    const [filteredPages, setFilteredPages]: [any, any] = useState([]);
    const [db, dbLoading] = useDb();
    const timerUrl = routerService.getRouteUrl('timer');
    
    useEffect(() => {
        if(db && pages){
            const pageSessions = pagesService.getSessionsFromDB(db);
            
            const _pages = pages.map((page: any) => {
                page.sessions = pageSessions[page.title] || [];
                page.sessions = page.sessions.filter((session: any) => session.repetition === 'Yes');
                pagesService.addSessionDiffFromToday(page.sessions);
                return page;
            });

            pagesService.sortPages(_pages);
            setFilteredPages(_pages);
        }
    }, [pages, db]);

    const viewPageInfo = (page: any) => {
        routerService.gotoUrl(`${timerUrl}?pageUrl=${encodeURIComponent(page.self)}`);
    };

    const allPages = (
        <>
            <TextField
                fullWidth
                autoComplete="off"
                className="searchBox"
                id="outlined-secondary"
                label="Search Pages"
                variant="outlined"
                onChange={(event: any) => {
                    const searchTxt = event.target.value.toLowerCase();

                    const _filteredPages = pages.filter((page: any) => {
                        const pageTitle = page.title.toLowerCase();
                        const sectionName = page.parentSection.displayName.toLowerCase();
                        const sessions = page.sessions;
                        
                        return utilsService.containsWord(pageTitle, searchTxt) || utilsService.containsWord(sectionName, searchTxt) || sessions.find((section: any) => section.daysDiffFromToday === Number(searchTxt))
                    });

                    setFilteredPages(_filteredPages);
                }}
            />


            <PageList keyProp='id' viewPageInfo={viewPageInfo} filteredPages={filteredPages}></PageList>
        </>
    );

    return (
        <>
            <Layout
                hideNavDrawer={true}
                routeInfo={routerService.getRouteInfo('recentlyCreatedPages')}>
                {
                    dbLoading || pagesLoading ? (<LinearProgress color="secondary" />) : allPages
                }
            </Layout>
        </>
    );
});