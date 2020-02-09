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

    isLoggedIn(): Boolean {
        return Boolean(clientStorage.getItemSync('token'));
    }

    logout(){
        return Boolean(clientStorage.removeItemSync('token'));
    }

    static getInstance() {
        if (!UserService._userService) {
            UserService._userService = new UserService();
        }

        return UserService._userService;
    }
}

export default UserService.getInstance();