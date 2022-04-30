const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Clock = require('../utils/Clock');
const {DaysEnum, MonthsEnum} = require('./Calendar')

class AlarmGoal extends Goal {
    constructor (dd = -1, hh = 6, mm = 45, bedroom) {
        super ();
        
        this.dd = dd;        
        this.hh = hh;
        this.mm = mm;
        this.bedroom = bedroom
    }
}

class AlarmIntention extends Intention {
    constructor (agent, goal) {
        super (agent, goal);
        
        this.dd = this.goal.dd;
        this.hh = this.goal.hh;
        this.mm = this.goal.mm;
        this.bedroom = this.goal.bedroom;
    }

    static applicable(goal) {
        return goal instanceof AlarmGoal;
    }

    setNextAlarm() {
        let nextDay = Clock.global.dd + 1; 
        this.dd = nextDay;
        switch (nextDay) {
            case DaysEnum.monday:
            case DaysEnum.tuesday:
            case DaysEnum.thursday:
            case DaysEnum.friday:
                {
                    this.hh = 6;
                    this.mm = 45;
                }
            break;
            case DaysEnum.saturday:
            case DaysEnum.sunday:
                {
                    this.hh = 8;
                    this.mm = 0;
                }
            break;
            case DaysEnum.wednesday:
            default:
                {
                    this.dd = -1;
                    this.hh = 0;
                    this.mm = 0;
                }
        }
    }

    *exec() {
        var alarmGoal = [];
        let alarmGoalPromise = new Promise ( async res => {
            let curr_day = Clock.global.dd;
            while(true) {
                let status = await Clock.global.notifyChange('mm');
                if (this.bedroom.in_people_nr > 0)
                    if (this.dd != -1) {
                        if (Clock.global.dd == this.dd && Clock.global.hh == this.hh && Clock.global.mm == this.mm) {
                            let day = Object.keys(DaysEnum).find(k => DaysEnum[k] === Clock.global.dd);
                            this.log(day + ' alarm: it\'s ' + 
                                (Clock.global.hh < 10 ? '0' : '') + Clock.global.hh + ':' + 
                                (Clock.global.mm < 10 ? '0' : '') + Clock.global.mm + '!');
                            this.setNextAlarm();
                        }
                    }
                    else if (curr_day != Clock.global.dd) {
                        curr_day = Clock.global.dd;
                        this.setNextAlarm();
                    }
                
                if (curr_day != Clock.global.dd)
                        curr_day = Clock.global.dd;
            }
        });
    
        alarmGoal.push(alarmGoalPromise);
        yield Promise.all(alarmGoal);
    }
}

module.exports = {AlarmGoal, AlarmIntention}