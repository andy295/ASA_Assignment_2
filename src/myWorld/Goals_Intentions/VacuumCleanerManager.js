const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');

class VacuumCleanerGoal extends Goal {

    constructor (device) {
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
                if (device.getClean())
                {

                    this.log('floor ' + this.agent.getOperationLevel() + 
                        ' needs to be cleaned');
                    
                    this.agent.clean(device.getGoal());
                    
                    device.resetGoal();
                }
            }
        });

        cleanlinessGoal.push(cleanGoalPromise)
    }
}

module.exports = {VacuumCleanerGoal, VacuumCleanerIntention}