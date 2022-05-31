const Agent = require('../../bdi/Agent')
const pddlActionIntention = require('../../pddl/actions/pddlActionIntention')
const GlobalUtilities = require('../Utilities/GlobalUtilities');
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../../utils/Communicator');

class HouseAction {
	constructor (agent, parameters) {
		this.agent = agent;
		this.parameters = parameters;
	}

	get precondition () {
		return pddlActionIntention.ground(this.constructor.precondition, this.parameters);
	}
	
	checkPrecondition () {
		return this.agent.beliefs.check(...this.precondition);
	}

	get effect () {
		return pddlActionIntention.ground(this.constructor.effect, this.parameters);
	}

	applyEffect () {
		for (let b of this.effect)
			this.agent.beliefs.apply(b);
	}

	async checkPreconditionAndApplyEffect () {
		if (this.checkPrecondition()) {
			this.applyEffect();

			let action_time = GlobalUtilities.stringToInt(this.parameters.action_time);
			if (isNaN(action_time) || action_time == 0)
				action_time = 25;
			else
				action_time = GlobalUtilities.actionTimeMs(action_time);

			await new Promise(res=>setTimeout(res,action_time));
		}
		else
			throw new Error('pddl precondition not valid'); //Promise is rejected!
	}
}

class HouseMove extends HouseAction {
	static parameters = ['robot', 'from', 'to'];

	static precondition = [
		['is_room', 'from'],
		['is_room', 'to'],
		['is_robot', 'robot'],
		['connected', 'from', 'to'],
		['in', 'obj', 'room1'] ];

	static effect = [
		['in', 'robot', 'to'],
		['not in', 'robot', 'from'] ];
}

class HouseClean extends HouseAction {
	static parameters = ['robot', 'room'];

	static precondition = [
		['is_room', 'room'],
		['is_robot', 'robot'],
		['dirty', 'room'],
		['in', 'robot', 'room'] ];
		
	static effect = [
		['clean', 'room'],
		['not dirty', 'room'] ];
}

class HouseAgent extends Agent {
	constructor(name) {
		super(name);

        this.intentions.push(PostmanAcceptAllRequest)
        this.postSubGoal(new Postman())

		this.#AddAction();
	}

	#AddAction() {
		this.Move = function ({robot, from, to} = args) {
			this.log('House: Move', robot, from, to)
			return new Move(this, {robot, from, to} ).checkPreconditionAndApplyEffect()
			.catch(err=>{this.error('House.Move failed:', err.message || err); throw err;})
		}
		
		this.Clean = function ({robot, room, action_time} = args) {
			this.log('House: Clean', robot, room, action_time)
			return new Clean(this, {robot, room, action_time} ).checkPreconditionAndApplyEffect()
			.catch(err=>{this.error('House.Clean failed:', err.message || err); throw err;})
		}
	}
}

module.exports = HouseAgent;