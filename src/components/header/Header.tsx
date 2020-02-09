import React, { useContext } from 'react';
import './header.scss';
import { AppBar, Toolbar, IconButton, Typography, makeStyles, createStyles, Theme, Link } from '@material-ui/core';
import { AccountCircle, Home } from '@material-ui/icons';
import IHeader from "./IHeader";
import { themeConfig } from '../../services/config';
import NavDrawer from '../nav-drawer';
import { userService, routerService } from '../../services';

const useStyles = (hideNavDrawer: IHeader['hideNavDrawer']) => {
    return makeStyles((theme: Theme) =>
        createStyles({
            appBar: {
                [theme.breakpoints.up('sm')]: {
                    width: hideNavDrawer ? '100%' : `calc(100% - ${themeConfig.drawerWidth}px)`,
                    marginLeft: themeConfig.drawerWidth
                },
            },
            menuButton: {
                marginRight: theme.spacing(2),
                [theme.breakpoints.up('sm')]: {
                    display: 'none'
                }
            },
            homeButton: {
                marginLeft: '10px',
                marginRight: '5px'
            },
            toolbar: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0px',
                paddingRight: '15px'
            }
        })
    );
}

export default ({ pageName, hideNavDrawer = false, history }: IHeader) => {
    const classes = useStyles(hideNavDrawer)();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const gotoHome = () => {
        let homeRoute = routerService.getHomeRoute();
        history.push(homeRoute.path);
    };

    const logout = () => {
        userService.logout();
        history.push(routerService.getRouteUrl('login'));
    };

    const userDetails = (<div className="account-details">
        <span className="user-name">{userService.userDetails?.account.name}</span>
        <AccountCircle />
        <span onClick={logout} className="logout">Logout</span>
    </div>);

    return (
        <>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    {/* <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <Home />
                    </IconButton> */}
                    <Typography variant="h6" noWrap>
                        <>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                className={classes.homeButton}
                                onClick={gotoHome}>
                                <Home />
                            </IconButton>
                            <span style={{ position: 'relative', top: '2px' }}>{pageName}</span>
                        </>
                    </Typography>

                    {userService.isLoggedIn() ? userDetails : null}
                </Toolbar>
            </AppBar>

            {/* {!hideNavDrawer ? <NavDrawer open={mobileOpen} onClose={handleDrawerToggle} /> : null} */}
        </>
    );
};
