import React, { useContext, useState } from 'react';
import Layout from '../../components/layout/layout';
import { routerService } from '../../services';
import StatsProvider from './statsProvider';
import { StatsContext } from './statsProvider';
import { TableContainer, Table, makeStyles, TableHead, TableRow, TableCell, TableBody, Typography, TablePagination } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Charts from './Charts';
import Nothing from '../../components/Nothing/Nothing';
import './_stats.module.scss';

const TableComponent = () => {
    const useStyles = makeStyles({
        table: {
            minWidth: 650
        },
    });

    const classes = useStyles();

    const { rows, stats }: any = useContext(StatsContext);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);


    const viewPageInfo = (page: any) => {
        routerService.viewPageInfo(page);
    };

    return (
        <>
            <Typography variant="h5" component="h5" gutterBottom>Total time: {stats.totalTime} hours, Average time: {stats.averageTime} hours per day</Typography>

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Time Spent (Minutes, Hours)</TableCell>
                            <TableCell align="center">Pages (Minutes, Hours)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(currentPage * rowsPerPage, (currentPage * rowsPerPage) + rowsPerPage).map((row: any, index: number) => (
                            <TableRow key={index}>
                                <TableCell align="center">{row.date}</TableCell>
                                <TableCell align="center">{row.totalTimeSpent}, {row.totalTimeSpentHours}</TableCell>
                                <TableCell align="center">{
                                    row.pages.map((page: any, index: number) => {
                                        return (
                                            <p onClick={() => viewPageInfo(page.sessions[0])} key={index}>
                                                {page.title} ({page.stats.totalSessionMinutes}, {page.stats.totalSessionHours})
                                            </p>
                                        )
                                    })
                                }</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={currentPage}
                    onChangePage={(event, newPage) => setCurrentPage(newPage)}
                    onChangeRowsPerPage={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                />
            </TableContainer>
        </>
    );
};

const StatsComponent = () => {
    const { rows }: any = useContext(StatsContext);
    const Component = (
        <>
            <Charts></Charts>
            <TableComponent></TableComponent>
        </>
    );

    return (
        <>
            {rows?.length > 0? Component: <Nothing></Nothing>} 
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