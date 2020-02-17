import localforage from "localforage";

class ClientSideDataStorage {
    private storage = localforage.createInstance({
        name: "nameHere"
    });

    setItemSync(key:string, value: string){
        if(value){
            localStorage.setItem(key, value);
        }else{
            this.removeItemSync(key);
        }
    }

    getItemSync(key:string){
        return localStorage.getItem(key)
    }

    removeItemSync(key:string){
        return localStorage.removeItem(key);
    }

    setItem(key:any, value: any){
        this.storage.setItem(key, value);
    }

    getItem(key: any){
        return this.storage.getItem(key);
    }

    removeItem(key: any){
        return this.storage.removeItem(key);
    }

    static _instance: ClientSideDataStorage;

    static getInstance() {
        if (!ClientSideDataStorage._instance) {
            ClientSideDataStorage._instance = new ClientSideDataStorage();
        }

        return ClientSideDataStorage._instance;
    }
}

export default ClientSideDataStorage.getInstance();