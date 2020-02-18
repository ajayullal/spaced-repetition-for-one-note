class DateService{
    static _instance: DateService;

    diffBetweenDates(date1: string, date2: string){
        const _date1: any = new Date(date1);
        const _date2: any = new Date(date2);
        const diffTime = Math.abs(_date2 - _date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays;
    }

    diffFromToday(date: string){
        const _date1: any = new Date(date);
        const _date2: any = new Date();
        const diffTime = Math.abs(_date2 - _date1);
        const diffDays = Math.trunc(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays;
    }

    static getInstance(){
        if(!DateService._instance){
            DateService._instance = new DateService();
        }

        return DateService._instance;
    }
}

export default DateService.getInstance();