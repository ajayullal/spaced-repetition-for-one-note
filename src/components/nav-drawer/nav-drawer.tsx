import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Hidden, Typography } from '@material-ui/core';
import { createStyles, Theme, makeStyles, useTheme } from '@material-ui/core/styles';
import { themeConfig, appTexts } from '../../services/config';
import INavDrawer from './INavDrawer';
import logo from '../../logo.svg';
import './nav-drawer.scss';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawer: {
            [theme.breakpoints.up('sm')]: {
                flexShrink: 0,
            }
        },
        drawerPaper: {
            width: themeConfig.drawerWidth,
        },
        toolbar: theme.mixins.toolbar
    })
);

export default ({ open, onClose, children }: INavDrawer) => {
    const classes = useStyles();
    const theme = useTheme();

    // const noteBookList: any = (<List>
    //     {noteBooks.map((text, index) => (
    //         <ListItem button key={text}>
    //             <ListItemIcon><BookIcon /></ListItemIcon>
    //             <ListItemText primary={text} />
    //         </ListItem>
    //     ))}
    // </List>);

    const drawer = (
        <div>
            <div className="logo-container">
                <img src={logo} width="40" height="40" />
                <Typography className="app-name" variant="h6">
                    {/* {appTexts.appName} */}
                    <ArrowBackIosIcon onClick={onClose} className="closeIcon"></ArrowBackIosIcon>
                </Typography>
            </div>

            <Divider />

            {children}
        </div >
    );

    return (
        <nav className={classes.drawer} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
                <Drawer
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    onClose={onClose}>
                    {drawer}
                </Drawer>
            </Hidden>

            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="temporary"
                    open={open}>
                    {drawer}
                </Drawer>
            </Hidden>
        </nav>
    );
};