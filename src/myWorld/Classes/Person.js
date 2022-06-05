const Observable = require('../../utils/Observable');

class Person extends Observable {
    constructor (house, name, in_room) {
        super({name: name, in_room: in_room})
        this.house = house;
        this.name = name;
        this.in_room = in_room;
        this.prev_room = in_room;
    }

    moveTo (to) {
        if (!this.house.roomExists(to)) {
            this.error(to + ' is not a valid room');
            return false;
        }

        if (to == this.in_room) {
            this.error(this.name + ' is already in room ' + this.in_room);
            return false;
        }

        this.prev_room = this.in_room;
        this.in_room = to;
        this.house.updateRoomStatus(this.prev_room, this.in_room);
        
        return true;
    }

    getLocation() {
        return this.in_room;
    }

    getName() {
        return this.name;
    }
}

module.exports = Person;