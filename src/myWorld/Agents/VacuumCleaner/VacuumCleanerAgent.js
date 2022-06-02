const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../../../utils/Communicator');
const {RetryGoal, RetryIntention} = require('../../Goals_Intentions/Retry'); 
const PlanningGoal = require('../../../pddl/PlanningGoal');
const {Move, Clean} = require('./VacuumCleanerActions');
const Agent = require('../../../bdi/Agent');
const Room = require('../../Classes/Room');

class VacuumCleanerAgent extends Agent {
	constructor(name, op_level) {
		super(name);
        
        let {OnlinePlanning} = require('../../../pddl/OnlinePlanner')([Move, Clean]);
        this.intentions.push(OnlinePlanning);
        
        this.intentions.push(PostmanAcceptAllRequest)
        this.postSubGoal(new Postman())
        
        this.intentions.push(RetryIntention)

        this.operationLevel = op_level;
        this.clean_time = {};
        this.deviceType = 'vacuumCleaner';
        this.device = new Object();
	}

    getName() {
        return this.name;
    }

    setCleanTime(room) {
        this.clean_time[room.name] = room.clean_time;
    }

    clean(goal) {
        this.postSubGoal( 
            new RetryGoal( 
                { goal: new PlanningGoal( 
                    { goal: goal } ) } ) );
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

var vacuumCleanerAgents = [];

var gfVCAgent = new VacuumCleanerAgent('gfvc', 0);
vacuumCleanerAgents.push(gfVCAgent);

var ffVCAgent = new VacuumCleanerAgent('ffvc', 1);
vacuumCleanerAgents.push(ffVCAgent);

module.exports = vacuumCleanerAgents;