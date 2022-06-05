const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');


class VacuumCleanerGoal extends Goal {

    constructor () {
        super();
    }
}

class VacuumCleanerIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal);
    }
    
    static applicable (goal) {
        return goal instanceof VacuumCleanerGoal;
    }

    *exec () {
        var cleanlinessGoal = [];
        let cleanGoalPromise = new Promise( async res => {

            while (true) {
                let device = this.agent.getDevice();
                let needToClean = await device.notifyChange('clean');

                if (device.needClean())
                {
                    // enable it if you need more traces
                    // this.log('floor ' + this.agent.getOperationLevel() + 
                    //     ' needs to be cleaned');
                    
                    this.agent.clean(device.getGoal());
                    
                    device.reset(this.agent.getCleanTimeList());
                }
            }
        });

        cleanlinessGoal.push(cleanGoalPromise)
    }
}

module.exports = {VacuumCleanerGoal, VacuumCleanerIntention}