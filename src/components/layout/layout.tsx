import React, { useEffect, useRef } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, Theme, createStyles, Typography, Link } from '@material-ui/core';
import Header from '../header/Header';
import ILayout from './ILayout';
import routeService from '../.../../../services/route.service';
import {withRouter} from 'react-router-dom';
import ErrorAlert from '../error-alert/ErrorAlert';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    link: {
      display: 'flex',
    },
    icon: {
      marginRight: theme.spacing(0.5),
      width: 20,
      height: 20,
    },
    breadcrumb: {
      marginBottom: 20
    }
  })
);

export default withRouter(function Layout({ errorMessage, routeInfo, children, hideNavDrawer = false, history }: any) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      
      <ErrorAlert errorMessage={errorMessage} />

      <Header history={history} hideNavDrawer={hideNavDrawer} pageName={routeInfo.name} />

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
});
