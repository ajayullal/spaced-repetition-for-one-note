class UtilsService{
    static _instance: UtilsService;

   replaceParamsInUrl(url: string, params: {[key: string]: any}){
        Object.entries(params).forEach(([key, value]) => {
            url = url.replace(`:${key}`, value);
        });

        return url;
    }

    containsWord(srcStr: string, searchStr: string){
        searchStr = searchStr.toLowerCase().trim();
        srcStr = srcStr.toLowerCase().trim();
        const words = srcStr.split(' ');
        return words.filter((word: string) => {
            return word.startsWith(searchStr);
        }).length > 0;
    }
    
    static getInstance(){
        if(!UtilsService._instance){
            UtilsService._instance = new UtilsService();
        }

        return UtilsService._instance;
    }
}

export default UtilsService.getInstance();