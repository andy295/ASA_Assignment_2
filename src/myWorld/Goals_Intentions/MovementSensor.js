const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Room = require('../Classes/Room');

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
                        let status = await person.notifyChange('in_room');
                        this.log('sense: ' + person.name + ' in ' + person.in_room );
                        this.agent.beliefs.declare('people_in_' + person.in_room);

                        // enable the following loop if you need more trace
                        // for (let [key_t, room] of Object.entries(this.rooms)) {
                        //     if (room.name == person.in_room) {
                        //         this.log(room.in_people_nr + ' people in ' + room.name + ' (current)')
                        //         break;
                        //     }
                        // }

                        for (let [key_t, room] of Object.entries(this.rooms)) {
                            if (room.name == person.prev_room) {
                                // enable the following instruction if you need more trace
                                // this.log(room.in_people_nr + ' people in ' + room.name + ' (previous)')
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