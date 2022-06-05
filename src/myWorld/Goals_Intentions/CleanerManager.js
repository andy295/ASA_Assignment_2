const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Clock = require('../../utils/Clock');
const Room = require('../Classes/Room');
const VacuumCleaner  = require('../Classes/Devices/VacuumCleaner');


class CleanlinessGoal extends Goal {

    constructor (rooms, devices, hh = 10) {
        super();

        this.rooms = rooms;
        this.devices = devices;
        this.hh = hh;
    }
}

class CleanlinessIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal);

        this.rooms = this.goal.rooms;
        this.devices = this.goal.devices;
        this.hh = this.goal.hh;
    }
    
    static applicable (goal) {
        return goal instanceof CleanlinessGoal;
    }

    *exec () {
        var cleanlinessGoal = [];
        let cleanGoalPromise = new Promise( async res => {

            while (true) {
                let status = await this.agent.beliefs.notifyChange('check cleanliness');

                if (status) {
                    for (let [key_t, room] of Object.entries(this.rooms)) {

                        if (room.isCleanable()) {
                            room.updateClean();

                            if (!room.isClean()) {
                                for (let [level, device] of Object.entries(this.devices)) {

                                    if (room.getLevel() == level) {
                                        device.updateGoal('clean ' + room.name);
                                        this.agent.beliefs.declare('dirty ' + room.name);
                                        this.agent.beliefs.undeclare('clean ' + room.name);
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    for (let [level, device] of Object.entries(this.devices))
                        if (device.hasGoal()) {
                            device.updateGoal('in ' + device.getLocation());                            
                            device.startClean();
                        }

                    this.agent.beliefs.undeclare('check cleanliness');
                }
            }
        });

        cleanlinessGoal.push(cleanGoalPromise)
    }
}

module.exports = {CleanlinessGoal, CleanlinessIntention}