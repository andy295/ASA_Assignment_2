const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Clock = require('../../utils/Clock');
const {DaysEnum, MonthsEnum} = require('../Utilities/Calendar');


class ManageHouseGoal extends Goal {

    constructor (dd = 0) {
        super()

        this.dd = dd;
    }
}

class ManageHouseIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal);

        this.dd = this.goal.dd;
    }
    
    static applicable (goal) {
        return goal instanceof ManageHouseGoal;
    }

    setNextAlarm(hh, mm) {
        let nextDay = Clock.global.dd + 1;
        this.dd = nextDay;
        switch (nextDay) {
            case DaysEnum.monday:
            case DaysEnum.tuesday:
            case DaysEnum.wednesday:
            case DaysEnum.thursday:
            case DaysEnum.friday:
                {
                    hh = 6;
                    mm = 45;
                }
            break;
            case DaysEnum.saturday:
            case DaysEnum.sunday:
                {
                    hh = 8;
                    mm = 0;
                }
            break;
            default:
                {
                    dd = -1;
                    hh = 0;
                    mm = 0;
                }
            break;
        }
    }

    checkTime(kind, objTime) {
        
        switch(kind) {
            case 0:
                if (Clock.global.dd == this.dd && 
                    Clock.global.hh == objTime.getHH() && 
                    Clock.global.mm == objTime.getMM())
                    return true;
            break;
            case 1:
                let timeMin =  (Clock.global.hh * 60) + Clock.global.mm;
                let fromTimeMin = (objTime.getFromHH() * 60) + objTime.getFromMM();
                let toTimeMin = (objTime.getHH() * 60) + objTime.getMM();
        
                if ((timeMin <= toTimeMin) || (timeMin >= fromTimeMin))
                    return true;
            break;
            case 2:
                if (Clock.global.hh == objTime.getHH() && 
                    Clock.global.mm >= objTime.getMM()) {
                        return true;
                    }
            break;
            case 3:
                if (Clock.global.hh == objTime.getHH() && 
                    Clock.global.mm == objTime.getMM()) {
                    return true;
                }
            break;
            case 4:
                if(Clock.global.hh == objTime.getHH() &&
                    Clock.global.mm == objTime.getMM())
                    return true;
            break;
            default:
            break;
        }

        return false;
    }

    *exec () {
        var houseGoals = [];
        let houseGoalPromise = new Promise( async res => {

            while (true) {
                let status = await Clock.global.notifyChange('mm');
                let curr_day = Clock.global.dd;
                
                // alarm
                const alarmClock = this.agent.alarmClock; 
                if (this.checkTime(0, alarmClock)) {
                    this.agent.beliefs.declare('start alarm');
                    this.setNextAlarm(alarmClock.getHH(), alarmClock.getMM());
                }

                // light
                if (this.checkTime(1, this.agent.lightTime) &&
                    this.agent.beliefs.check('wake_up people')) {
                    if (!this.agent.beliefs.check('need light'))
                        this.agent.beliefs.declare('need light');
                }
                else {
                    if (this.agent.beliefs.check('need light') ||
                        this.agent.beliefs.check('wake_up people'))
                        this.agent.beliefs.undeclare('need light');
                }

                // sleep
                if (this.agent.beliefs.check('wake_up people') &&
                    this.checkTime(2, this.agent.sleepTime)) {
                        this.agent.beliefs.undeclare('wake_up people');
                        this.agent.beliefs.undeclare('open roll_up_shutter');
                    }

                // clean
                if (this.checkTime(3, this.agent.cleaningTime))
                    this.agent.beliefs.declare('check cleanliness'); 

                // consumption
                if (this.checkTime(4, this.agent.consumptionTime))
                    this.agent.beliefs.declare('compute consumption');

                if (curr_day != Clock.global.dd)
                    curr_day = Clock.global.dd;
            }
        });

        houseGoals.push(houseGoalPromise);
    }
}

module.exports = {ManageHouseGoal, ManageHouseIntention}