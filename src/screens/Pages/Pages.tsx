import withAuth from "../../HOCs/withAuth";
import usePages from "./usePages";
import React from "react";
import CardList from "../../components/card-list/CardList";
import Layout from "../../components/layout/layout";
import { LinearProgress } from "@material-ui/core";
import routerService from '../../services/route.service';

export default withAuth((props: any) => {
    const [pages, loading] = usePages(props.match.params.id);
    const timerUrl = routerService.getRouteUrl('timer');

    function viewPageInfo(page: any){
        props.history.push(`${timerUrl}?pageUrl=${encodeURIComponent(page.self)}`);
    }

    const sectionsGrid = (
        <CardList displayPropName='title' onClick={viewPageInfo} items={pages}></CardList>
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