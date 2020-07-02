import React from 'react';
import { routerService } from '../../services';
import Layout from '../../components/layout/layout';
import TaskNameInput from './TaskNameInput/TaskNameInput';

export default () => {

    return (
        <>
            <Layout hideNavDrawer={true} routeInfo={routerService.getRouteInfo('customTimer')}>
                <>
                    <TaskNameInput></TaskNameInput>
                </>
            </Layout>
        </>
    )
};