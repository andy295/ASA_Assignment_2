const Observable =  require('../utils/Observable')
const Logger =  require('./Logger')

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
            console.log(to + ' is not a valid room');
            return false;
        }

        if (to == this.in_room) {
            console.log(this.name + ' is already in room ' + this.in_room);
            return false;
        }

        // let doors_to = this.house.getRoom(this.in_room); 
        // if (!(to in doors_to)) {
        //     console.log(to + ' cannot be reached from ' + this.in_room);
        //      return false;
        // }

        // if (!(to in this.house.rooms.getItem(this.in_room).GetDoorsTo)) {
        //     console.log($(to) + ' is not reachable from ' + $(this.in_room));
        //     return false;
        // }

        // console.log(this.name + ' moved from ' + this.in_room + ' to ' + to);
        
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