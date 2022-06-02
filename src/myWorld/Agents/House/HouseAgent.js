const Agent = require('../../../bdi/Agent')
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../../../utils/Communicator');
const {Move, Clean} = require('./HouseActions');


class HouseAgent extends Agent {
	constructor(name) {
		super(name);

        this.intentions.push(PostmanAcceptAllRequest)
        this.postSubGoal(new Postman())

		this.#AddAction();
	}

	#AddAction() {
		this.move = function ({robot, from, to} = args) {
			this.log('House: Move', robot, from, to)
			return new Move(this, {robot, from, to} ).checkPreconditionAndApplyEffect()
			.catch(err=>{this.error('House.Move failed:', err.message || err); throw err;})
		}
		
		this.clean = function ({robot, room, action_time} = args) {
			this.log('House: Clean', robot, room, action_time)
			return new Clean(this, {robot, room, action_time} ).checkPreconditionAndApplyEffect()
			.catch(err=>{this.error('House.Clean failed:', err.message || err); throw err;})
		}
	}
}

var houseAgent = new HouseAgent('house');

module.exports = houseAgent;