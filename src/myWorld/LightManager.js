const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Device = require('./Device')
const Clock =  require('../utils/Clock');

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

    // *exec () {
    //     for (let r of this.rooms) {
    //         let room = this.rooms[r]
    //         let managealPromise = new Promise( async res => {
    //             while (true) {
    //                 let in_room = await p.notifyChange('in_room');
    //                 this.log('sense: light switched in ' + in_room);
    //                 this.agent.beliefs.declare('light_on ' + p.name, status == 'on');
    //                 this.agent.beliefs.declare('light_off ' + p.name, status == 'off');
    //             }
    //         });
    //     }
    // }

    lightNeeded() {
        if (Clock.global.hh <= 7 || Clock.global.hh >= 20)
            return true;

        return false;
    }

    *exec () {
        var lightsGoals = []
        for (let r in this.rooms) {   
            let room = this.rooms[r];    
            let light = room.getDevice('light');
            if (!(Object.entries(light).length === 0)) {
                let lightGoalPromise = new Promise( async res => {
                    while (true) {
                        let status = await this.agent.beliefs.notifyChange('people_in_' + room.name);
                        if (this.lightNeeded()) {
                            if (status) {
                                light.switchLightOn();
                            }
                            else if (room.in_people_nr == 0) {
                                light.switchLightOff()
                            }
                        }
                    }
                });

                lightsGoals.push(lightGoalPromise);
            }
        }

        yield Promise.all(lightsGoals)
    }
}

module.exports = {ManageLightsGoal, ManageLightsIntention}