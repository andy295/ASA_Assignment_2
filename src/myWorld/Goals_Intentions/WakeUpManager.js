const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Clock = require('../../utils/Clock');
const {DaysEnum, MonthsEnum} = require('../Utilities/Calendar');


class WakeUpGoal extends Goal {
    constructor (bedroom) {
        super ();

        this.bedroom = bedroom
    }
}

class WakeUpIntention extends Intention {
    constructor (agent, goal) {
        super (agent, goal);
        
        this.bedroom = this.goal.bedroom;
    }

    static applicable(goal) {
        return goal instanceof WakeUpGoal;
    }

    *exec() {
        var wakeUpGoal = [];
        let wakeUpGoalPromise = new Promise ( async res => {
            
            while(true) {
                let status = await this.agent.beliefs.notifyChange('start alarm');
                
                if (status) {
                    const alarmClock = this.agent.alarmClock; 

                    if (this.bedroom.getInPeopleNr() > 0) {
                        let day = Object.keys(DaysEnum).find(k => DaysEnum[k] === Clock.global.dd);
                
                        this.log(day + ' alarm: it\'s ' + 
                            (Clock.global.hh < 10 ? '0' : '') + Clock.global.hh + ':' + 
                            (Clock.global.mm < 10 ? '0' : '') + Clock.global.mm + '!');

                        this.agent.beliefs.declare('on ' + alarmClock.name);

                        this.bedroom.devices.light.switchLightOn() ?
                            this.agent.beliefs.declare(this.bedroom.name + ' light_on') :
                            null;

                        this.agent.beliefs.declare('open roll_up_shutter');
                    }

                    this.agent.beliefs.undeclare('start alarm')
                }
            }
        });
    
        wakeUpGoal.push(wakeUpGoalPromise);
    }
}

module.exports = {WakeUpGoal, WakeUpIntention}