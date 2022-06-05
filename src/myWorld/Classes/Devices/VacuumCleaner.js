const Device = require('./Device');


class VacuumCleaner extends Device {
    constructor (name, status, movable, consumption, location) {
        super(name, status, movable, consumption, location);
        this.location = location;

        // consumption => kW/h
        
        this.set('clean', false);

        this.goal = [];

        this.clean = false;
    }

    startClean() {
        this.clean = true;
    }

    stopClean() {
        this.clean = false;
    }

    isCleaning() {
        return this.clean;
    }

    needClean() {
        return this.clean;
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

    getLocation() {
        return this.location;
    }

    getCopy(roomName) {
        var copy = new VacuumCleaner(
                this.name,
                this.status,
                this.movable,
                this.consumption,
                roomName);

        return copy;
    }
}

module.exports = VacuumCleaner;