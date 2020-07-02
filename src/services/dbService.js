class DBService{
    static _instance;

    static getInstance(){
        if(!DBService._instance){
            DBService._instance = new DBService();
        }

        return DBService._instance;
    }   
}

export default DBService.getInstance();