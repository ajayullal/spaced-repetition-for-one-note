import utilsService from './utils.service';
import {Book, MenuBook, Note, Timer} from '@material-ui/icons';
import {serverBase} from './config';
import { createHashHistory } from 'history'
export const history = createHashHistory()

export const routeConfig: { [key: string]: any }  = {
    notebooks: {
        name: 'Notebooks',
        path: '/notebooks',
        isHomePage: true,
        icon: Book
    },
    sections: {
        name: 'Sections',
        path: '/notebooks/:id',
        icon: MenuBook
    },
    login: {
        name: 'Login',
        path: '/login'
    },
    pages: {
        name: 'Pages',
        path: '/sections/:id/pages',
        icon: Note
    },
    timer: {
        name: 'Timer',
        path: '/timer',
        icon: Timer
    },
    recentlyRevisedPages: {
        name: 'Recently Revised Pages',
        path: '/recently-revised-pages'
    },
    recentlyCreatedPages: {
        name: 'Recently Edited Pages',
        path: '/recently-edited-pages'
    }
};

export const breadCrumbs: {[key: string]: any} = {
    [routeConfig.sections.name]: [routeConfig.notebooks],
    [routeConfig.pages.name]: [routeConfig.notebooks, routeConfig.sections]
};

class RouteService{
    static _instance: RouteService;

    getBreadCrumbs(routeName: string){
        return breadCrumbs[routeName];
    }

    getHomeRoute(){
        let homeRoute = Object.entries(routeConfig).find((route: any) => route[1].isHomePage);
        return homeRoute? homeRoute[1] : null;
    }

    getRouteInfo(name: string){
        return routeConfig[name];
    }

    getRouteUrl(name: string, params: {} = {}){
        const routeInfo = this.getRouteInfo(name);
        // return `${serverBase}#${utilsService.replaceParamsInUrl(routeInfo.path, params)}`;
        return `${serverBase}/#${utilsService.replaceParamsInUrl(routeInfo.path, params)}`;
    }

    gotoUrl(url: string){
        history.push(url.replace(`${serverBase}/#`, ''));
    }

    goTo(name: string, params: {} = {}){
        const url = this.getRouteUrl(name, params);
        this.gotoUrl(url);
    }

    static getInstance(){
        if(!RouteService._instance){
            RouteService._instance = new RouteService();
        }

        return RouteService._instance;
    }
}

export default RouteService.getInstance();
