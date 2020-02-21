import React, { useEffect, useState } from 'react';
import withAuth from '../../HOCs/withAuth';
import './_pages.module.scss';
import Layout from '../../components/layout/layout';
import routerService from '../../services/route.service';
import useDb from '../../hooks/useDB';
import CardList from '../../components/card-list/CardList';
import { LinearProgress, TextField, Typography } from '@material-ui/core';
import pagesService from '../../services/pages.service';

export default withAuth((props: any) => {
    const [db, loading, setDb] = useDb();
    const [filteredPages, setFilteredPages]: [any, any] = useState([]);

    useEffect(() => {
        if (db && db.length > 0 && !db[0].sessions) {
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

    const viewPageInfo = () => {

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
                        return pageTitle.startsWith(searchTxt) || sectionName.startsWith(searchTxt) || sessions.find((section: any) => section.daysDiffFromToday === Number(searchTxt))
                    });

                    setFilteredPages(_filteredPages);
                }}
            />

            <CardList
                onClick={viewPageInfo}
                items={filteredPages}
                keyProp='pageId'
                render={(item: any) => {
                    return (
                        <div key={item}>
                            <Typography color="textSecondary" gutterBottom>
                                {item['title']}
                            </Typography>

                            <Typography color="textSecondary" gutterBottom>
                                <span>{item.sectionName}</span>
                            </Typography>

                            <Typography color="textSecondary" gutterBottom>
                                Last revisited:
                     
                                {item.sessions.length > 0 ? item.sessions.map(({ daysDiffFromToday, startDate, startTime }: any, index: number) => {
                                    return (<span key={`${startDate}*${startTime}`}> {daysDiffFromToday}{index !== item.sessions.length - 1 ? ', ' : ' days ago'}</span>)
                                }) : ' Never'}
                            </Typography>
                        </div>
                    );
                }}>
            </CardList>
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