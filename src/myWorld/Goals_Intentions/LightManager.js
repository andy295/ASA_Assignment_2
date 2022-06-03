const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Light = require('../Classes/Devices/Light');
const Clock = require('../../utils/Clock');


class ManageLightsGoal extends Goal {

    constructor (rooms = []) {
        super()

        /** @type {Array<Room>} */
        this.rooms = rooms;
    }
}

class ManageLightsIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal);
        
        /** @type {Array<Room>} */
        this.rooms = this.goal.rooms;
    }
    
    static applicable (goal) {
        return goal instanceof ManageLightsGoal;
    }

    lightNeeded(lightTiming) {
        if (Clock.global.hh < lightTiming.getToHH() ||
            Clock.global.hh > lightTiming.getFromHH())
            return true;

        return false;
    }

    *exec () {
        var lightsGoals = [];

        for (let [key_t, room] of Object.entries(this.rooms)) {
            if (room.devices.light) {

                let lightGoalPromise = new Promise( async res => {
                    while (true) {

                        let status = await this.agent.beliefs.notifyChange('people_in_' + room.name) ||
                            this.agent.beliefs.notifyChange('wake_up people');
                        
                        if (this.lightNeeded(this.agent.lightTiming) && 
                            this.agent.beliefs.check('wake_up people') && 
                            this.agent.beliefs.check('people_in_' + room.name)) {

                            room.devices.light.switchLightOn() ?
                            this.agent.beliefs.declare(room.name + ' light_on') :
                            null;
                        }
                        else {
                            room.devices.light.switchLightOff() ?
                            this.agent.beliefs.undeclare(room.name + ' light_on') :
                            null;
                        }
                    }
                });

                lightsGoals.push(lightGoalPromise);
            }
        }

        yield Promise.all(lightsGoals)
    }
}

class AutoTurnLightOnOffGoal extends Goal {

    constructor (rooms = []) {
        super()

        /** @type {Array<Room>} */
        this.rooms = rooms;
    }
}

class AutoTurnLightOnOffIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal);
        
        /** @type {Array<Room>} */
        this.rooms = this.goal.rooms;
    }
    
    static applicable (goal) {
        return goal instanceof AutoTurnLightOnOffGoal;
    }

    *exec () {
        var lightsOnOffGoals = [];
        let lightOnOffGoalPromise = new Promise( async res => {

            while (true) {
                let status = await this.agent.beliefs.notifyChange('need light');

                if (status) {
                    for (let [key_t, room] of Object.entries(this.rooms)) {
                        if (room.devices.light) {
                            if (room.getInPeopleNr() > 0)
                                room.devices.light.switchLightOn() ? 
                                    this.agent.beliefs.declare(room.name + ' light_on') :
                                    null;
                        }
                    }
                }
                else {
                    for (let [key_t, room] of Object.entries(this.rooms)) {
                        if (room.devices.light) {
                            room.devices.light.switchLightOff() ? 
                                this.agent.beliefs.undeclare(room.name + ' light_on') :
                                null;
                        }
                    }
                }
           }
       });

        lightsOnOffGoals.push(lightOnOffGoalPromise);
    }
}

module.exports = {ManageLightsGoal, ManageLightsIntention, AutoTurnLightOnOffGoal, AutoTurnLightOnOffIntention}