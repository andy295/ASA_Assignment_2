const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const SolarPanel = require('../Classes/Devices/SolarPanel');


class ManageSolarPanelGoal extends Goal {

    constructor (room) {
        super()

        this.room = room;
    }
}

class ManageSolarPanelIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal);
        
        this.room = this.goal.room;
    }
    
    static applicable (goal) {
        return goal instanceof ManageSolarPanelGoal;
    }

    *exec () {
        var solarPanelGoals = [];
        let solarPanelGoalPromise = new Promise( async res => {

            while (true) {
                let status = await this.agent.beliefs.notifyChange('energy produced');

                if (this.room.devices.hasOwnProperty('solarPanel')) {
                    const solarPanel = this.room.devices['solarPanel'];

                    if (status)
                        solarPanel.updateProcuction();
                }

                this.agent.beliefs.undeclare('energy produced');
           }
       });

       solarPanelGoals.push(solarPanelGoalPromise);
    }
}

module.exports = {ManageSolarPanelGoal, ManageSolarPanelIntention}