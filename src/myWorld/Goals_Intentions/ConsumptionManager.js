const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Room = require('../Classes/Room');
const Light = require('../Classes/Devices/Light');
const Thermostat = require('../Classes/Devices/Thermostat');
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
                let status = await this.agent.beliefs.notifyChange('compute consumption');

                if (status) {
                    let energyTotalConsumption = 0;

                    for (let [key_r, room] of Object.entries(this.rooms)) {

                        if (room.devices.hasOwnProperty('light')) {
                            // console.log(room.name + ' light ' + room.devices.light.isLightOn());
                            energyTotalConsumption += room.devices.light.getTotalConsumption();
                            room.devices.light.resetTotalConsumption();
                        }
                            
                        if (room.devices.hasOwnProperty('thermostat')) {
                            // console.log(room.name + ' temperature ' + room.devices.thermostat.getTemperature());
                            energyTotalConsumption += room.devices.thermostat.getTotalConsumption();
                            room.devices.thermostat.resetTotalConsumption();
                        }

                        if (room.devices.hasOwnProperty('rollUpShutter')) {
                            let list = room.devices['rollUpShutter'];

                            for (const rollUpShutter of list) {
                                // console.log(room.name + ' rollUpShutter ' + room.devices.rollUpShutter.isOpen());
                                energyTotalConsumption += rollUpShutter.getTotalConsumption();
                                rollUpShutter.resetTotalConsumption();
                            }
                        }
                    }   
                    
                    this.log('\tElectricity total consumption: ' + (Math.round(energyTotalConsumption * 100) / 100).toFixed(2));

                    this.agent.beliefs.undeclare('compute consumption');
                }
            }
        });

        consumptionGoals.push(consumptionGoalPromise);
    }
}

module.exports = {ManageConsumptionGoal, ManageConsumptionIntention}