const Device = require('./Device');

class VacuumCleaner extends Device {
    constructor (name, status, movable, consumption, location) {
        super(name, status, movable, consumption, location);
        this.location = location;

        this.set('clean', false);

        this.goal = [];

        // consumption => kW/h
    }

    move(room) { 
	    if (this.location != room) {
			this.position = room; 
		}
	}

    updateGoal(goal) {
        this.goal.push(goal);
    }

    getGoal() {
        return this.goal;
    }

    hasGoal() {
        return (this.goal.length > 0);
    }

    resetGoal() {
        this.goal = [];
    }

    resetClean() {
        this.clean = false;
    }

    setClean(value) {
        this.clean = value;
    }

    getClean() {
        return this.clean;
    }

    getLocation() {
        return this.location;
    }
}

module.exports = VacuumCleaner;