const Agent = require('../../bdi/Agent')
const pddlActionIntention = require('../../pddl/actions/pddlActionIntention')
const Room = require('../Classes/Room');
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../../utils/Communicator');

// vacuum cleaner actions

class Move extends pddlActionIntention {
    static parameters = ['from', 'to'];

    static precondition = [
        ['is_room', 'from'],
        ['is_room', 'to'],
        ['connected', 'from', 'to'],
        ['in', 'from'],
        ['is_robot'] ];

    static effect = [ ['in', 'to'], ['not in', 'from'] ];

    *exec ({from, to}=parameters) {
        yield houseAgent.move({
            robot: this.agent.name,
            from: from,
            to: to})
    }
}

class Clean extends pddlActionIntention {
    static parameters = ['room'];

    static precondition = [ ['is_room', 'room'],
        ['dirty', 'room'],
        ['in', 'room'],
        ['is_robot'] ];

    static effect = [ ['clean', 'room'], ['not dirty', 'room'] ];

    *exec ({room}=parameters) {
        yield houseAgent.clean({
            obj: this.agent.name,
            room: room,
            action_time: this.agent.clean_time[room]})
    }
}

class VacuumCleanerAgent extends Agent {
	constructor(name, op_level) {
		super(name);
        this.operation_level = op_level;
        
        this.goal = [];

        this.clean_time = {};
        this.#setCleanTime();

        let {OnlinePlanning} = require('../../pddl/OnlinePlanner')([Move, Clean]);
        this.intentions.push(OnlinePlanning);

        this.intentions.push(PostmanAcceptAllRequest)
        this.postSubGoal(new Postman())
	}

    #setCleanTime() {
        const roomsData = require('../Classes/house_config/Rooms.json');
        for(const room of roomsData)
            this.clean_time[room.name] = room.clean_time;
    }

    // todo
    // a1.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: a1.goal } ) } ) )
}

module.exports = VacuumCleanerAgent;