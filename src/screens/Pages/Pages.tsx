import withAuth from "../../HOCs/withAuth";
import usePages from "./usePages";
import React, { useEffect, useState, useCallback } from "react";
import CardList from "../../components/card-list/CardList";
import Layout from "../../components/layout/layout";
import { LinearProgress, TextField, Typography } from "@material-ui/core";
import routerService from '../../services/route.service';
import useDb from '../../hooks/useDB';
import pagesService from '../../services/pages.service';
import PageList from '../../components/pagesList/pagesList';
import utilsService from "../../services/utils.service";

export default withAuth((props: any) => {
    const [pages, loading]: any[] = usePages(props.match.params.id);
    const [filteredPages, setFilteredPages] = useState(pages);
    const timerUrl = routerService.getRouteUrl('timer');
    const [db, dblLoading] = useDb();

    const mergeDBAndPageData = useCallback(() => {
        pagesService.mergeDBAndPageData(db, pages);
        setFilteredPages(pages);
    }, [db, pages]);

    useEffect(() => {
        if (db && pages) {
            mergeDBAndPageData()
        }
    }, [db, mergeDBAndPageData, pages]);

    function viewPageInfo(page: any) {
        routerService.gotoUrl(`${timerUrl}?pageUrl=${encodeURIComponent(page.self)}`);
    }

    const sectionsGrid = (
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
                        return utilsService.containsWord(page.title, searchTxt);
                    });

                    setFilteredPages(_filteredPages);
                }}
            />

            <PageList viewPageInfo={viewPageInfo} filteredPages={filteredPages}></PageList>
        </>
    );

    return (
        <Layout hideNavDrawer={true} routeInfo={routerService.getRouteInfo('pages')}>
            <>
                {
                    (loading || dblLoading) ? (<LinearProgress color="secondary" />) : sectionsGrid
                }
            </>
        </Layout>
    );
});