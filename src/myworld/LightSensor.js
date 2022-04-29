const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Light = require('./Light');

class SenseLightsGoal extends Goal {

    constructor (people = []) {
        super()

        /** @type {Array<Person>} */
        this.people = person;
    }
}

class SenseLightsIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal);
        
        /** @type {Array<People>} */
        this.people = this.goal.people;
    }
    
    static applicable (goal) {
        return goal instanceof SenseLightsGoal;
    }

    *exec () {
        for (let person of this.people) {
            let lightGoalPromise = new Promise( async res => {
                while (true) {
                    let in_room = await p.notifyChange('in_room');
                    this.log('sense: light switched in ' + in_room);
                    this.agent.beliefs.declare('light_on ' + p.name, status == 'on');
                    this.agent.beliefs.declare('light_off ' + p.name, status == 'off');
                }
            });
        }
    }
}

module.exports = {SenseLightsGoal, SenseLightsIntention}