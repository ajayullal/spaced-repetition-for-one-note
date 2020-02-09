import React, {useContext} from 'react';
import Layout from '../../components/layout/layout';
import { LinearProgress } from '@material-ui/core';
import withAuth from '../../HOCs/withAuth';
import useSections from './useSections';
import CardList from '../../components/card-list/CardList';
import routerService from '../../services/route.service';

export default withAuth((props: any) => {
    const [sections] = useSections(props.match.params.id);

    function viewPages(section: any){
        props.history.push(routerService.getRouteUrl('pages', {id: section.id}));
    }

    const sectionsGrid = (
        <CardList displayPropName='displayName' onClick={viewPages} items={sections || []}></CardList>
    );

    return (
        <Layout hideNavDrawer={true} routeInfo={routerService.getRouteInfo('sections')}>
            <>
                {
                    sections?.length > 0 ? sectionsGrid:  (<LinearProgress color="secondary" />)
                }
            </>
        </Layout>
    );
});