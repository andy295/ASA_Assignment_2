const Agent = require('../../bdi/Agent')
const pddlActionIntention = require('../../pddl/actions/pddlActionIntention')
const Room = require('../Classes/Room');
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../../utils/Communicator');
const {RetryGoal, RetryIntention} = require('../Goals_Intentions/Retry'); 
const PlanningGoal = require('../../pddl/PlanningGoal')

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
        
        let {OnlinePlanning} = require('../../pddl/OnlinePlanner')([Move, Clean]);
        this.intentions.push(OnlinePlanning);
        
        this.intentions.push(PostmanAcceptAllRequest)
        this.postSubGoal(new Postman())
        
        this.intentions.push(RetryIntention)

        this.operationLevel = op_level;
        this.clean_time = {};
        this.goal = [];
        this.deviceType = 'vacuumCleaner';
        this.device;
	}

    getName() {
        return this.name;
    }

    setCleanTime(room) {
        this.clean_time[room.name] = room.clean_time;
    }

    clean(goal) {
        if(this.goal.length > 0)
            this.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: goal } ) } ) );
    }

    getOperationLevel() {
        return this.operationLevel;
    }

    updateGoal(room) {
        this.goal.push('clean ' + room);
    }

    setDevice(device) {
        this.device = device;
    }

    getDevice() {
        return this.device;
    }

    getType() {
        return this.deviceType;
    }
}

module.exports = VacuumCleanerAgent;