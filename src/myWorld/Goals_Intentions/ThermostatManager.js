const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Thermostat = require('../Classes/Devices/Thermostat');
const Clock = require('../../utils/Clock');


class ManageThermostatsGoal extends Goal {

    constructor (rooms = []) {
        super()

        /** @type {Array<Room>} */
        this.rooms = rooms;
    }
}

class ManageThermostatsIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal);
        
        /** @type {Array<Room>} */
        this.rooms = this.goal.rooms;
    }
    
    static applicable (goal) {
        return goal instanceof ManageThermostatsGoal;
    }

    *exec () {
        var thermostatsGoals = [];

        for (let [key_t, room] of Object.entries(this.rooms)) {
            if (room.devices.thermostat) {
                let thermostatGoalPromise = new Promise( async res => {
                    while (true) {
                        let temperature = await room.devices.thermostat.notifyChange('temperature');
                        if (temperature < room.devices.thermostat.getMinTemperature() ||
                            temperature > room.devices.thermostat.getMaxTemperature()) {
                            room.devices.thermostat.switchCCSystemOn()
                            this.agent.beliefs.declare(room.name + ' climate_control_system_on');
                        }
                        else {
                            room.devices.thermostat.switchCCSystemOff();
                            this.agent.beliefs.undeclare(room.name + ' climate_control_system_on');
                        }
                    }
                });

                thermostatsGoals.push(thermostatGoalPromise);
            }
        }

        yield Promise.all(thermostatsGoals)
    }
}

module.exports = {ManageThermostatsGoal, ManageThermostatsIntention}