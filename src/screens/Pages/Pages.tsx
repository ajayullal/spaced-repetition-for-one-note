import withAuth from "../../HOCs/withAuth";
import usePages from "./usePages";
import React, { useEffect, useState } from "react";
import CardList from "../../components/card-list/CardList";
import Layout from "../../components/layout/layout";
import { LinearProgress, TextField, Grid } from "@material-ui/core";
import routerService from '../../services/route.service';
import './_pages.scss';

export default withAuth((props: any) => {
    const [pages, loading]: any[] = usePages(props.match.params.id);
    const [filteredPages, setFilteredPages] = useState(pages);
    const timerUrl = routerService.getRouteUrl('timer');

    useEffect(() => {
        setFilteredPages(pages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pages]);

    function viewPageInfo(page: any) {
        routerService.gotoUrl(`${timerUrl}?pageUrl=${encodeURIComponent(page.self)}`);
    }

    const sectionsGrid = (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        className='searchBox'
                        id="outlined-secondary"
                        label="Search Pages"
                        variant="outlined"
                        onChange={(event: any) => {
                            const searchTxt = event.target.value.toLowerCase();
                            
                            const _filteredPages = pages.filter((page: any) => {
                                const pageTitle = page.title.toLowerCase();
                                return pageTitle.startsWith(searchTxt);
                            });

                            setFilteredPages(_filteredPages);
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <CardList displayPropName='title' onClick={viewPageInfo} items={filteredPages}></CardList>
                </Grid>
            </Grid>
        </>
    );

    return (
        <Layout hideNavDrawer={true} routeInfo={routerService.getRouteInfo('pages')}>
            <>
                {
                    loading ? (<LinearProgress color="secondary" />) : sectionsGrid
                }
            </>
        </Layout>
    );
});