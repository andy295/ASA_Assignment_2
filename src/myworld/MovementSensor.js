const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Room = require('./room');

class SenseMovementsGoal extends Goal {

    constructor (people = [], rooms = []) {
        super();

        /** @type {Array<Person>} people */
        this.people = people;

        /** @type {Array<Room>} rooms */
        this.rooms = rooms;
    }
}

class SenseMovementsIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal);
     
        /** @type {Array<Person>} people */
        this.people = this.goal.people;

        /** @type {Array<Room>} rooms */
        this.rooms = this.goal.rooms;
    }
    
    static applicable (goal) {
        return goal instanceof SenseMovementsGoal;
    }

    *exec () {
        var movementsGoal = [];
        for (let p in this.people) {
                let person = this.people[p];
                let movementGoalPromise = new Promise( async res => {
                    while (true) {
                        let status = await person.notifyChange('in_room')
                        this.log('sense: ' + person.name + ' in ' + person.in_room )
                        // this.agent.beliefs.declare('light_on '+l.name, status=='on')
                        // this.agent.beliefs.declare('light_off '+l.name, status=='off')
                    }
                });

            movementsGoal.push(movementGoalPromise)
        }
     
        yield Promise.all(movementsGoal)
    }
}

module.exports = {SenseMovementsGoal, SenseMovementsIntention}