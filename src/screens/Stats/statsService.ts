import utilsService from '../../services/utils.service';

class StatsService {
    static _instance: StatsService;

    formatData(db: any) {
        const dbDateMap: any = {};

        db.forEach((row: any) => {
            const startDate = this.formatDate(row.startDate);
            dbDateMap[startDate] = dbDateMap[startDate] || { totalTimeSpent: 0, date: startDate, pages: {} };
            row.totalSessionMinutes = utilsService.round(row.totalSessionMinutes);
            row.totalSessionHours = utilsService.round(row.totalSessionMinutes / 60);
            dbDateMap[startDate].totalTimeSpent += row.totalSessionMinutes;
            dbDateMap[startDate].totalTimeSpentHours = utilsService.round(dbDateMap[startDate].totalTimeSpent / 60);
            dbDateMap[startDate].pages[row.title] = dbDateMap[startDate].pages[row.title] || { stats: { totalSessionHours: 0, totalSessionMinutes: 0 }, sessions: [] };
            dbDateMap[startDate].pages[row.title].stats.totalSessionHours += row.totalSessionHours;
            dbDateMap[startDate].pages[row.title].stats.totalSessionMinutes += row.totalSessionMinutes;
            dbDateMap[startDate].pages[row.title].sessions.push(row);
        });

        let rows = Object.keys(dbDateMap).map(date => dbDateMap[date]);
        rows.forEach(row => {
            let pages = row.pages;
            row.pages = [];
            Object.keys(pages).forEach(title => {
                pages[title].title = title;
                pages[title].stats.totalSessionHours = utilsService.round(pages[title].stats.totalSessionHours);
                pages[title].stats.totalSessionMinutes = utilsService.round(pages[title].stats.totalSessionMinutes);
                row.pages.push(pages[title])
            });
        });

        return rows.reverse();
    }

    getTotalAndAverageTime(rows: any) {
        const totalTime = utilsService.round(rows.reduce((sum: any, row: any) => row.totalTimeSpentHours + sum, 0));
        const averageTime = utilsService.round(totalTime / rows.length);
        return { totalTime, averageTime };
    }

    formatDate(date: string) {
        //  date is assumed to be in mm/dd/yyyy format
        const dtArr = date.split('/');
        const month = dtArr[0];
        dtArr[0] = dtArr[1];
        dtArr[1] = month;
        return dtArr.join('/');
    }



    static getInstance() {
        if (!StatsService._instance) {
            StatsService._instance = new StatsService();
        }

        return StatsService._instance;
    }
}

export default StatsService.getInstance();