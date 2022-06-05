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
		this.#createAlarmClock(this.alarmClock);

		this.lightTime = new Object();
		this.#createTimer(this.lightTime);
		this.#createLightTime(this.lightTime);

		this.cleaningTime = new Object();
		this.#createTimer(this.cleaningTime);

		this.sleepTime = new Object();
		this.#createTimer(this.sleepTime);

		this.consumptionTime = new Object();
		this.#createTimer(this.consumptionTime);

		this.solarPanelTime = new Object();
		this.#createTimer(this.solarPanelTime);
		this.#createLightTime(this.solarPanelTime);

		this.#addAction();
	}

	#addAction() {
		this.move = function ({robot, from, to} = args) {
			this.log('House: Move', robot, from, to)
			return new Move(this, {robot, from, to} ).checkPreconditionAndApplyEffect()
			.catch(err=>{this.error('House.Move failed:', err.message || err); throw err;})
		}
		
		this.clean = function ({robot, room, actionTime} = args) {
			this.log('House: Clean', robot, room, actionTime)
			return new Clean(this, {robot, room, actionTime} ).checkPreconditionAndApplyEffect()
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

	#createAlarmClock(obj) {
		obj.name = 'house alarm clock',
		
		obj.getName = function() {
				return this.name;
		}
	}

	#createLightTime(obj) {
		obj.fromHH = 19;
		obj.fromMM = 0;

		obj.getFromHH = function() {
			return this.fromHH;
		}

		obj.getFromMM = function() {
			return this.fromMM;
		}

		obj.setTimeFrom = function(hh, mm) {
			this.fromHH = hh;
			this.fromMM = mm;
		}
	}
}

var houseAgent = new HouseAgent('house');

houseAgent.lightTime.setTimeFrom(21, 30);
houseAgent.alarmClock.setTime(6, 30);
houseAgent.lightTime.setTime(7, 0)
houseAgent.cleaningTime.setTime(10, 30);
houseAgent.sleepTime.setTime(23, 30);
houseAgent.consumptionTime.setTime(23, 55);
houseAgent.solarPanelTime.setTimeFrom(8, 0);
houseAgent.solarPanelTime.setTime(18, 0);

module.exports = houseAgent;