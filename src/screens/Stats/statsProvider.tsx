import React, { useEffect } from 'react';
import useDb from '../../hooks/useDB';
import { LinearProgress } from '@material-ui/core';
import statsService from './statsService';

export const StatsContext: any = React.createContext({});

export default (props: any) => {
    const [db, dbLoading] = useDb();
    const rows = db && statsService.formatData(db);
    const stats = db && statsService.getTotalAndAverageTime(rows)

    return (
        <StatsContext.Provider value={{rows, stats}}>
            {
                dbLoading ? (<LinearProgress color="secondary" />) : props.children
            }
        </StatsContext.Provider>
    );
};