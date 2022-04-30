const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Room = require('./Room');

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
                        this.agent.beliefs.declare('people_in_' + person.in_room, true)
                        
                        for (let r in this.rooms) {
                            let room = this.rooms[r];
                            if (room.name == person.prev_room) {
                                if (room.in_people_nr == 0)
                                    this.agent.beliefs.undeclare('people_in_' + person.prev_room);        
                                
                                break;
                            }
                        }
                    }
                });

            movementsGoal.push(movementGoalPromise)
        }
     
        yield Promise.all(movementsGoal)
    }
}

module.exports = {SenseMovementsGoal, SenseMovementsIntention}