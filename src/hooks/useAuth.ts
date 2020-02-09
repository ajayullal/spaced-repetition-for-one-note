import authService from '../services/user.service';
import {routeConfig} from '../services/route.service';
import clientStorageService from '../services/client-side-data-storage.service';
import userService from '../services/user.service';

export default (history: any) => {
    if(!userService.isLoggedIn()){
        history.push(routeConfig.login.path);
        return [false];
    }

    return [true];
};