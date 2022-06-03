const { TestWatcher } = require('jest');
const Agent = require('../../../bdi/Agent')
const {MessageDispatcher, Postman, PostmanAcceptAllRequest} = require('../../../utils/Communicator');
const house = require('../../Classes/House');
const {Move, Clean, TurnOffAlarmClock} = require('./HouseActions');


class HouseAgent extends Agent {
	constructor(name) {
		super(name);

        this.intentions.push(PostmanAcceptAllRequest)
        this.postSubGoal(new Postman())
		
		this.alarmClock = new Object();
		this.#createTimer(this.alarmClock);
		this.#createAlarmClock();

		this.lightTime = new Object();
		this.#createTimer(this.lightTime);
		this.#createLightTime();

		this.cleaningTime = new Object();
		this.#createTimer(this.cleaningTime);

		this.sleepTime = new Object();
		this.#createTimer(this.sleepTime);

		this.consumptionTime = new Object();
		this.#createTimer(this.consumptionTime);

		this.#addAction();
	}

	#addAction() {
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

		this.turnOffAlarmClock = function() {
			this.log('House: Turn off alarm clock', this.alarmClock.name)
			const alarmClock = this.alarmClock.name;
			return new TurnOffAlarmClock(this, {alarmClock} ).checkPreconditionAndApplyEffect()
			.catch(err=>{this.error('House.TurnOffAlarmClock failed:', err.message || err); throw err;})
		}
	}

	#createTimer(obj) {
		obj.hh = 6;
		obj.mm = 0;

		obj.getHH = function() {
			return this.hh;
		}

		obj.getMM = function() {
			return this.mm;
		}

		obj.setTime = function(hh, mm) {
			this.hh = hh;
			this.mm = mm;
		}
	}

	#createAlarmClock() {
		this.alarmClock.name = 'house alarm clock',
		
		this.alarmClock.getName = function() {
				return this.name;
		}
	}

	#createLightTime() {
		this.lightTime.fromHH = 19;
		this.lightTime.fromMM = 0;

		this.lightTime.getFromHH = function() {
			return this.fromHH;
		}

		this.lightTime.getFromMM = function() {
			return this.fromMM;
		}

		this.lightTime.setTimeFrom = function(hh, mm) {
			this.fromHH = hh;
			this.fromMM = mm;
		}
	}
}

var houseAgent = new HouseAgent('house');

houseAgent.alarmClock.setTime(6, 30);
houseAgent.lightTime.setTimeFrom(21, 30);
houseAgent.lightTime.setTime(7, 0)
houseAgent.cleaningTime.setTime(10 , 30);

module.exports = houseAgent;