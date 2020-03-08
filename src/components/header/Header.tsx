import React from 'react';
import './header.scss';
import { AppBar, Toolbar, IconButton, Typography, makeStyles, createStyles, Theme } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import IHeader from "./IHeader";
import { themeConfig } from '../../services/config';
import { userService, routerService } from '../../services';
import MenuIcon from '@material-ui/icons/Menu';

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

export default ({ pageName, hideNavDrawer = false, history, toggleNavDrawer }: IHeader) => {
    const classes = useStyles(hideNavDrawer)();
    const loginRouteInfo = routerService.getRouteInfo('login');
    const isLoginPage = pageName === loginRouteInfo.name;

    const logout = () => {
        userService.logout();
        history.push(routerService.getRouteUrl('login'));
    };

    const userDetails = (<div className="account-details">
        <span className="user-name">{userService.userDetails?.account.name}</span>
        <AccountCircle />
        <span onClick={logout} className="logout">Logout</span>
    </div>);

    const menuIcon = (
        <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            className={classes.homeButton}
            onClick={toggleNavDrawer}>
            <MenuIcon />
        </IconButton>
    );

    return (
        <>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h6" noWrap>
                        <>
                            {
                                !isLoginPage ? menuIcon: ''
                            }

                            <span style={{ marginLeft: isLoginPage? '23px': '', position: 'relative', top: '2px' }}>{pageName}</span>
                        </>
                    </Typography>

                    {userService.isLoggedIn() ? userDetails : null}
                </Toolbar>
            </AppBar>
        </>
    );
};
