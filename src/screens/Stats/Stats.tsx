import React, { useContext } from 'react';
import Layout from '../../components/layout/layout';
import { routerService } from '../../services';
import StatsProvider from './statsProvider';
import { StatsContext } from './statsProvider';
import { TableContainer, Table, makeStyles, TableHead, TableRow, TableCell, TableBody, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Charts from './Charts';

const TableComponent = () => {
    const useStyles = makeStyles({
        table: {
            minWidth: 650
        },
    });

    const classes = useStyles();

    const {rows, stats}: any = useContext(StatsContext);

    return (
        <>
            <Typography variant="h5" component="h5"  gutterBottom>Total time: {stats.totalTime} hours, Average time: {stats.averageTime} hours per day</Typography>
            
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Time Spent (Minutes, Hours)</TableCell>
                            <TableCell align="center">Pages</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row: any, index: number) => (
                            <TableRow key={index}>
                                <TableCell align="center">{row.date}</TableCell>
                                <TableCell align="center">{row.totalTimeSpent}, {row.totalTimeSpentHours}</TableCell>
                                <TableCell align="center">{
                                    row.pages.map((page: any, index: number) => {
                                        return (
                                            <p key={index}>
                                                {page.title} ({page.totalSessionMinutes}, {page.totalSessionHours})
                                            </p>
                                        )
                                    })
                                }</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

const StatsComponent = () => {
    return (
        <>
            <Charts></Charts>
            <TableComponent></TableComponent>
        </>
    );
};

export default () => {
    return (
        <Layout hideNavDrawer={true} routeInfo={routerService.getRouteInfo('stats')}>
            <StatsProvider>
                <StatsComponent></StatsComponent>
            </StatsProvider>
        </Layout>
    );
};