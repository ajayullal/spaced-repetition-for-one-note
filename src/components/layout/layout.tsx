import React, { useEffect, useRef, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, Theme, createStyles, Typography, Link, IconButton } from '@material-ui/core';
import Header from '../header/Header';
import ILayout from './ILayout';
import routeService from '../.../../../services/route.service';
import { withRouter } from 'react-router-dom';
import ErrorAlert from '../error-alert/ErrorAlert';
import NavDrawer from '../nav-drawer';

import BookIcon from '@material-ui/icons/Book';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import Pages from '@material-ui/icons/Pages';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

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
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
  })
);

export default withRouter(function Layout({ errorMessage, routeInfo, children, hideNavDrawer = false, history }: any) {
  const classes = useStyles();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className={classes.root}>
      <CssBaseline />

      <ErrorAlert errorMessage={errorMessage} />

      <Header toggleNavDrawer={() => { setNavOpen(navOpen => !navOpen) }} history={history} hideNavDrawer={hideNavDrawer} pageName={routeInfo.name} />

      <NavDrawer open={navOpen} onClose={() => setNavOpen(false)}>
        <List>
          <ListItem onClick={() => {
            const notebooks = routeService.getRouteInfo('notebooks');
            routeService.gotoUrl(`${notebooks.path}`);
          }} button>
            <ListItemIcon><BookIcon /></ListItemIcon>
            <ListItemText primary={routeService.getRouteInfo('notebooks').name} />
          </ListItem>
          
          <ListItem onClick={() => {
             const recentlyRevisedPages = routeService.getRouteInfo('recentlyRevisedPages');
             routeService.gotoUrl(`${recentlyRevisedPages.path}`);
          }} button>
            <ListItemIcon><WatchLaterIcon /></ListItemIcon>
            <ListItemText primary={routeService.getRouteInfo('recentlyRevisedPages').name} />
          </ListItem>

          <ListItem onClick={() => {
             const recentlyCreatedPages = routeService.getRouteInfo('recentlyCreatedPages');
             routeService.gotoUrl(`${recentlyCreatedPages.path}`);
          }} button>
            <ListItemIcon><Pages /></ListItemIcon>
            <ListItemText primary={routeService.getRouteInfo('recentlyCreatedPages').name} />
          </ListItem>
        </List>
      </NavDrawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
});
