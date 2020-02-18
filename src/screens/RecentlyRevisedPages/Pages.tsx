import React, { useEffect } from 'react';
import withAuth from '../../HOCs/withAuth';
import './_pages.module.scss';
import Layout from '../../components/layout/layout';
import routerService from '../../services/route.service';
import useDb from '../../hooks/useDB';
import CardList from '../../components/card-list/CardList';
import { LinearProgress } from '@material-ui/core';

export default withAuth((props: any) => {
    const [db, loading] = useDb();

    useEffect(() => {
        console.log(db);
    }, [db]);

    const viewPageInfo = () => {

    };

    const allPages = (
        <CardList displayPropName='title' onClick={viewPageInfo} items={db}></CardList>
    );

    return (
        <Layout 
            hideNavDrawer={true} 
            routeInfo={routerService.getRouteInfo('recentlyRevisedPages')}>
                 {
                    loading ? (<LinearProgress color="secondary" />) : allPages
                }
        </Layout>
    );
});