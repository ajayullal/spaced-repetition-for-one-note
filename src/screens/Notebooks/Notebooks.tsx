import React from 'react';
import Layout from '../../components/layout/layout';
import { LinearProgress } from '@material-ui/core';
import useBooks from './useBooks';
import withAuth from '../../HOCs/withAuth';
import routerService from '../../services/route.service';
import CardList from '../../components/card-list/CardList';

export default withAuth((props: any) => {
    const [noteBooks, errorMessage] = useBooks();

    const viewSections = (noteBook: any) => {
        props.history.push(routerService.getRouteUrl('sections', { id: noteBook.id }));
    };

    const noteBooksGrid = (<CardList displayPropName='displayName' onClick={viewSections} items={noteBooks || []}></CardList>);

    return (
        <Layout 
            errorMessage={errorMessage} 
            hideNavDrawer={true} 
            routeInfo={routerService.getRouteInfo('notebooks')}>
            {
                !noteBooks ? (<LinearProgress color="secondary" />) : noteBooksGrid
            }
        </Layout>
    );
});