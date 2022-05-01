const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Device = require('./Device')
const Clock =  require('../utils/Clock');

// how can I merge the following six classes in just two (goal and intention) ?

class ManageLightsGoal extends Goal {

    constructor (rooms = [], hh_from = 6, hh_to = 23) {
        super()

        /** @type {Array<Room>} */
        this.rooms = rooms;

        this.hh_from = hh_from;
        this.hh_to = hh_to;
    }
}

class ManageLightsIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal);
        
        /** @type {Array<Room>} */
        this.rooms = this.goal.rooms;

        this.hh_from = this.goal.hh_from;
        this.hh_to = this.goal.hh_to;
    }
    
    static applicable (goal) {
        return goal instanceof ManageLightsGoal;
    }

    lightNeeded() {
        if (Clock.global.hh >= this.hh_from || Clock.global.hh < this.hh_to)
            return true;

        return false;
    }

    *exec () {
        var lightsGoals = [];

        for (let [key_t, room] of Object.entries(this.rooms)) {
            if (room.devices.light) {
                let lightGoalPromise = new Promise( async res => {
                    while (true) {
                        let status = await this.agent.beliefs.notifyChange('people_in_' + room.name);
                        if (this.lightNeeded()) {
                            if (status) {
                                room.devices.light.switchLightOn();
                                this.agent.beliefs.declare(room.name + ' light_on', true)
                            }
                            else {
                                room.devices.light.switchLightOff();
                                this.agent.beliefs.undeclare(room.name + ' light_on')
                            }
                        }
                        else {
                            room.devices.light.switchLightOff();
                            this.agent.beliefs.undeclare(room.name + ' light_on')
                        }
                    }
                });

                lightsGoals.push(lightGoalPromise);
            }
        }

        yield Promise.all(lightsGoals)
    }
}

// how can a goal be executed just one time per day every day
// without continue to catch the notifyChange after it has been completed?
// the following code doesn't work

class AutoTurnLightOffGoal extends Goal {

    constructor (rooms = [], hh = 7, mm = 0) {
        super()

        /** @type {Array<Room>} */
        this.rooms = rooms;

        this.hh = hh;
        this.mm = mm;
    }
}

class AutoTurnLightOffIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal);
        
        /** @type {Array<Room>} */
        this.rooms = this.goal.rooms;

        this.hh = this.goal.hh;
        this.mm = this.goal.mm;
    }
    
    static applicable (goal) {
        return goal instanceof AutoTurnLightOffGoal;
    }

    *exec () {
        var lightsGoals = [];
        
        for (let [key_t, room] of Object.entries(this.rooms)) {
            if (room.devices.light) {
                let lightOffGoalPromise = new Promise( async res => {
                    while (true) {
                        let status = await Clock.global.notifyChange('hh');
                        if (Clock.global.hh > 7 ) {
                            if (room.devices.light.isLightOn()) {
                                room.devices.light.switchLightOff(); 
                                this.agent.beliefs.undeclare(room.name + ' light_on')
                            }
                        }
                    }
                });

                lightsGoals.push(lightOffGoalPromise);
            }
        }

        yield Promise.all(lightsGoals)
    }
}

class AutoTurnLightOnGoal extends Goal {

    constructor (rooms = [], hh = 7, mm = 0) {
        super()

        /** @type {Array<Room>} */
        this.rooms = rooms;

        this.hh = hh;
        this.mm = mm;
    }
}

class AutoTurnLightOnIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal);
        
        /** @type {Array<Room>} */
        this.rooms = this.goal.rooms;

        this.hh = this.goal.hh;
        this.mm = this.goal.mm;
    }
    
    static applicable (goal) {
        return goal instanceof AutoTurnLightOnGoal;
    }

    *exec () {
        var lightsGoals = [];
        
        for (let [key_t, room] of Object.entries(this.rooms)) {
            let lightOnGoalPromise = new Promise( async res => {
                while (true) {
                    let status = await Clock.global.notifyChange('hh');
                    if (Clock.global.hh == 20 && Clock.global.mm == 0) {
                        if (room.in_people_nr > 0 && room.devices.light && !room.devices.light.isLightOn()) {
                            room.devices.light.switchLightOn(); 
                            this.agent.beliefs.declare(room.name + ' light_on', true)
                        }
                    }
                }
            });
        
            lightsGoals.push(lightOnGoalPromise);
        }

        yield Promise.all(lightsGoals)
    }
}

module.exports = {ManageLightsGoal, ManageLightsIntention, AutoTurnLightOffGoal, AutoTurnLightOffIntention, AutoTurnLightOnGoal, AutoTurnLightOnIntention}