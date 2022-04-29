const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Clock = require('../utils/Clock');

class AlarmGoal extends Goal {
    constructor (hh = 25, mm = 0) {
        super ();
        
        this.hh = hh;
        this.mm = mm;
    }
}

class AlarmIntention extends Intention {
    constructor (agent, goal) {
        super (agent, goal);
        
        this.hh = this.goal.hh;
        this.mm = this.goal.mm;
    }

    static applicable(goal) {
        return goal instanceof AlarmGoal;
    }

    *exec() {
        var alarmGoal = [];
        let alarmGoalPromise = new Promise ( async res => {
            while(true) {
                let status = await Clock.global.notifyChange('mm');
                if (this.hh != 25 && Clock.global.hh == this.hh && Clock.global.mm == this.mm)
                    this.log('Alarm it\'s ' + Clock.global.hh + ':' + Clock.global.mm + ' am!');
            }
        });

        alarmGoal.push(alarmGoalPromise);
        yield Promise.all(alarmGoal);
    }
}



module.exports = {AlarmGoal, AlarmIntention}