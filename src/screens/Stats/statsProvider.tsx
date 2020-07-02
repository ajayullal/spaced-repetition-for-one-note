import React, { useEffect } from 'react';
import useDb from '../../hooks/useDB';
import { LinearProgress } from '@material-ui/core';
import statsService from './statsService';

export const StatsContext: any = React.createContext({});

export default (props: any) => {
    const [db, dbLoading] = useDb();
    const value = db && statsService.formatData(db);

    return (
        <StatsContext.Provider value={value}>
            {
                dbLoading ? (<LinearProgress color="secondary" />) : props.children
            }
        </StatsContext.Provider>
    );
};