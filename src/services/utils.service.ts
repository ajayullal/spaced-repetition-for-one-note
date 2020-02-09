class UtilsService{
    static _instance: UtilsService;

   replaceParamsInUrl(url: string, params: {[key: string]: any}){
        Object.entries(params).forEach(([key, value]) => {
            url = url.replace(`:${key}`, value);
        });

        return url;
    }
    
    static getInstance(){
        if(!UtilsService._instance){
            UtilsService._instance = new UtilsService();
        }

        return UtilsService._instance;
    }
}

export default UtilsService.getInstance();