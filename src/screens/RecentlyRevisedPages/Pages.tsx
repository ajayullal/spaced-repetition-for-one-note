import React, { useEffect, useState } from 'react';
import withAuth from '../../HOCs/withAuth';
import './_pages.module.scss';
import Layout from '../../components/layout/layout';
import routerService from '../../services/route.service';
import useDb from '../../hooks/useDB';
import { LinearProgress, TextField } from '@material-ui/core';
import pagesService from '../../services/pages.service';
import PageList from '../../components/pagesList/pagesList';
import utilsService from '../../services/utils.service';

export default withAuth((props: any) => {
    const [db, loading, setDb] = useDb();
    const [filteredPages, setFilteredPages]: [any, any] = useState([]);

    useEffect(() => {
        if (db?.length > 0 && !db[0].sessions) {
            const pageSessions = pagesService.getSessionsFromDB(db);
   
            const pages = Object.entries(pageSessions).map(([, sessions]: any) => {
                return {
                    ...sessions[0],
                    sessions: pagesService.addSessionDiffFromToday(sessions)
                }
            });

            pagesService.sortPages(pages);
            
            setDb(pages);
            setFilteredPages(pages);
        }
    }, [db, setDb]);

    const viewPageInfo = (page: any) => {
        routerService.viewPageInfo(page);
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

                    const _filteredPages = db.filter((page: any) => {
                        const pageTitle = page.title.toLowerCase();
                        const sectionName = page.sectionName.toLowerCase();
                        const sessions = page.sessions;
                        return utilsService.containsWord(pageTitle, searchTxt) || utilsService.containsWord(sectionName, searchTxt) || sessions.find((section: any) => section.daysDiffFromToday === Number(searchTxt))
                    });

                    setFilteredPages(_filteredPages);
                }}
            />
            

            <PageList viewPageInfo={viewPageInfo} keyProp='pageId' filteredPages={filteredPages}></PageList>
        </>
    );

    return (
        <>
            <Layout
                hideNavDrawer={true}
                routeInfo={routerService.getRouteInfo('recentlyRevisedPages')}>
                {
                    loading ? (<LinearProgress color="secondary" />) : allPages
                }
            </Layout>
        </>
    );
});