import utilsService from './utils.service';
import {Book, MenuBook, Note, Timer} from '@material-ui/icons';

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
        return utilsService.replaceParamsInUrl(routeInfo.path, params);
    }

    static getInstance(){
        if(!RouteService._instance){
            RouteService._instance = new RouteService();
        }

        return RouteService._instance;
    }
}

export default RouteService.getInstance();
