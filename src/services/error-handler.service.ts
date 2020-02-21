import {userService, routerService} from './';

const errorMessage = {
    401: "Request failed with status code 401"
};

class ErrorHandlerService {
    static _instance: ErrorHandlerService;

    constructor() {

    }

    logout() {
        userService.logout();
        window.location.replace(routerService.getRouteUrl('login')) 
    }

    handleError = (error: any) => {
        console.error(error);

        switch (error.message) {
            case errorMessage['401']: 
                        this.logout();
                        break;
        }

        return Promise.reject(error.message || error.response.data.message)
    }

    static getInstance() {
        if (!ErrorHandlerService._instance) {
            ErrorHandlerService._instance = new ErrorHandlerService();
        }
        return ErrorHandlerService._instance;
    }
}

export default ErrorHandlerService.getInstance();