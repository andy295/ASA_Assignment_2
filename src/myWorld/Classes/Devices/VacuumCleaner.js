const Device = require('./Device');

class VacuumCleaner extends Device {
    constructor (name, status, movable, consumption, location) {
        super(name, status, movable, consumption, location);
        this.location = location;

        this.set('clean', false);

        // consumption => kW/h
    }

    Move(room) { 
	    if (this.location != room) {
			this.position = room; 
		}
	}
}

module.exports = VacuumCleaner;