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
		
		this.alarmClock;
		this.#createAlarmClock();

		this.lightTiming;
		this.#createLight();

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
			this.log('House: Turn off alamr clock', this.alarmClock.name)
			const alarmClock = this.alarmClock.name;
			return new TurnOffAlarmClock(this, {alarmClock} ).checkPreconditionAndApplyEffect()
			.catch(err=>{this.error('House.TurnOffAlarmClock failed:', err.message || err); throw err;})
		}
	}

	#createAlarmClock() {
		this.alarmClock = {
			'name': 'house alarm clock',
			'hh': 6,
			'mm': 30,

			'setAlarm': function(hh, mm) {
				this.hh = hh;
				this. mm = mm
			},

			'getHH': function() {
				return this.hh;
			},

			'getMM' : function() {
				return this.mm;
			},

			'getName' : function() {
				return this.name;
			},
		};
	}

	#createLight() {
		this.lightTiming = {
			'fromHH': 19,
			'fromMM': 0,
			'toHH': 8,
			'toMM': 0,

			'getFromHH': function() {
				return this.fromHH;
			},

			'getFromMM' : function() {
				return this.fromMM;
			},

			'getToHH': function() {
				return this.toHH;
			},

			'getToMM' : function() {
				return this.toMM;
			},

			'setTimeFrom' : function(hh, mm) {
				this.fromHH = hh;
				this.fromMM = mm;
			},

			'setTimeTo' : function(hh, mm) {
				this.toHH = hh;
				this.toMM = mm;
			},
		};
	}
}

var houseAgent = new HouseAgent('house');

houseAgent.alarmClock.setAlarm(6, 30);
houseAgent.lightTiming.setTimeFrom(21, 30);
houseAgent.lightTiming.setTimeTo(7, 0)

module.exports = houseAgent;