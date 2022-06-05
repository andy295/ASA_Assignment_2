const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const RollUpShutter = require('../Classes/Devices/RollUpShutter');
const Clock = require('../../utils/Clock');


class ManageRollUpShuttersGoal extends Goal {

    constructor (rooms = []) {
        super()

        /** @type {Array<Room>} */
        this.rooms = rooms;
    }
}

class ManageRollUpShuttersIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal);
        
        /** @type {Array<Room>} */
        this.rooms = this.goal.rooms;
    }
    
    static applicable (goal) {
        return goal instanceof ManageRollUpShuttersGoal;
    }

    *exec () {
        var rollUpShuttersGoals = [];
        let rollUpShuttersGoalPromise = new Promise( async res => {

            while (true) {
                let status = await this.agent.beliefs.notifyChange('open roll_up_shutter');

                for (let [key_t, room] of Object.entries(this.rooms)) {
                    if (room.devices.hasOwnProperty('rollUpShutter')) {
                        let list = room.devices['rollUpShutter'];

                        if (status) {
                            if (room.getName() == 'study') {
                                let x = 0;
                            }

                            for (const rollUpShutter of list) {
                                rollUpShutter.open() ? 
                                this.agent.beliefs.declare(room.name + ' ' +
                                    rollUpShutter.getName() + 
                                    '_' + rollUpShutter.getType() + 
                                    ' open') :
                                null;
                            }
                        }
                        else {
                            for (const rollUpShutter of list) {
                                rollUpShutter.close() ? 
                                this.agent.beliefs.undeclare(room.name + ' ' +
                                    rollUpShutter.getName() + 
                                    '_' + rollUpShutter.getType() + 
                                    ' open') :
                                null;
                            }
                        }
                    }
                }
           }
       });

       rollUpShuttersGoals.push(rollUpShuttersGoalPromise);
    }
}

module.exports = {ManageRollUpShuttersGoal, ManageRollUpShuttersIntention}