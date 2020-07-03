import clientStorage from './client-side-data-storage.service';

class UserService {
    static _userService: UserService;
    _userDetails: any;

    constructor(){
        const userDetails = clientStorage.getItemSync('userDetails');

        if(userDetails){
            this._userDetails = JSON.parse(userDetails);
        }
    }

    set userDetails(details: any) {
        this._userDetails = details;
    }

    get userDetails() {
        return this._userDetails;
    }

    getToken(){
        const tokenResponse = clientStorage.getItemSync('tokenResponse');
        return tokenResponse? JSON.parse(tokenResponse): null;
    }

    isLoggedIn(): Boolean {
        return Boolean(clientStorage.getItemSync('tokenResponse'));
    }

    logout(){
        return Boolean(clientStorage.removeItemSync('tokenResponse'));
    }

    static getInstance() {
        if (!UserService._userService) {
            UserService._userService = new UserService();
        }

        return UserService._userService;
    }
}

export default UserService.getInstance();