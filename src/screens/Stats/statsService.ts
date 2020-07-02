import utilsService from '../../services/utils.service';

class StatsService{
    static _instance: StatsService;

    formatData(db: any){
        const dbDateMap: any = {};

        db.forEach((row: any) => {
            const startDate = this.formatDate(row.startDate);
            dbDateMap[startDate] = dbDateMap[startDate] || {totalTimeSpent: 0, date: startDate, pages: []};
            row.totalSessionMinutes = utilsService.round(row.totalSessionMinutes);
            row.totalSessionHours = utilsService.round(row.totalSessionMinutes / 60);
            dbDateMap[startDate].totalTimeSpent += row.totalSessionMinutes;
            dbDateMap[startDate].totalTimeSpentHours = utilsService.round(dbDateMap[startDate].totalTimeSpent/ 60);
            dbDateMap[startDate].pages.push(row);
        });

       return Object.keys(dbDateMap).map(date => dbDateMap[date]).reverse();
    }

    formatDate(date: string){
        //  date is assumed to be in mm/dd/yyyy format
        const dtArr = date.split('/');
        const month = dtArr[0];
        dtArr[0] = dtArr[1];
        dtArr[1] = month;
        return dtArr.join('/');
    }

  

    static getInstance(){
        if(!StatsService._instance){
            StatsService._instance = new StatsService();
        }

        return StatsService._instance;
    }
}

export default StatsService.getInstance();