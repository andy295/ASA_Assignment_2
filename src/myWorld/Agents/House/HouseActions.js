const GlobalUtilities = require('../../Utilities/GlobalUtilities');
const pddlActionIntention = require('../../../pddl/actions/pddlActionIntention');

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
			if (isNaN(action_time) || action_time <= 0)
				action_time = 25;
			else
				action_time = GlobalUtilities.actionTimeMs(action_time);

			await new Promise(res=>setTimeout(res,action_time));
		}
		else
			throw new Error('pddl precondition not valid'); //Promise is rejected!
	}
}
class Move extends HouseAction {
	static parameters = ['robot', 'from', 'to'];

	static precondition = [
		['is_room', 'from'],
		['is_room', 'to'],
		['is_robot', 'robot'],
		['connected', 'from', 'to'],
		['in', 'robot', 'from'] ];

	static effect = [
		['in', 'robot', 'to'],
		['not in', 'robot', 'from'] ];
}
class Clean extends HouseAction {
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

class TurnOffAlarmClock extends HouseAction {
	static parameters = ['alarmClock'];

	static precondition = [
		['on', 'alarmClock'] ];

	static effect = [
		['not on', 'alarmClock'],
		['wake_up people'] ];
}

module.exports = {Move, Clean, TurnOffAlarmClock}