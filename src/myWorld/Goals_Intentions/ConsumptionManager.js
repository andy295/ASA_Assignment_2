const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Device = require('../Classes/Device');
const Clock = require('../../utils/Clock');

class ManageConsumptionGoal extends Goal {

    constructor (rooms = []) {
        super()

        /** @type {Array<Room>} */
        this.rooms = rooms;
    }
}

class ManageConsumptionIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal);
        
        /** @type {Array<Room>} */
        this.rooms = this.goal.rooms;
    }
    
    static applicable (goal) {
        return goal instanceof ManageConsumptionGoal;
    }

    *exec () {
        var consumptionGoals = [];
        let consumptionGoalPromise = new Promise( async res => {
            while (true) {
                let status = await Clock.global.notifyChange('mm');
                    if (Clock.global.hh == 23 && Clock.global.mm == 55) {
                        let electricity_total_consumption = 0;
                        for (let [key_r, room] of Object.entries(this.rooms)) {
                            if (room.devices.light) {
                                // console.log(room.name + ' light ' + room.devices.light.isLightOn())
                                electricity_total_consumption += room.devices.light.getTotalConsumption();
                                room.devices.light.resetTotalConsumption();
                            }
                            
                            if (room.devices.thermostat) {
                                // console.log(room.name + ' temperature ' + room.devices.thermostat.getTemperature())
                                electricity_total_consumption += room.devices.thermostat.getTotalConsumption();
                                room.devices.thermostat.resetTotalConsumption();
                            }
                        }   
                    
                        console.log('\tElectricity total consumption: ' + (Math.round(electricity_total_consumption * 100) / 100).toFixed(2));
                    }
                }
            });

            consumptionGoals.push(consumptionGoalPromise);

        yield Promise.all(consumptionGoals)
    }
}

module.exports = {ManageConsumptionGoal, ManageConsumptionIntention}