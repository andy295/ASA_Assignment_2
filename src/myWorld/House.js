const Person =  require('./Person')
const Room =  require('./Room')
const Logger =  require('./Logger')

class House {
    constructor () {
        this.people = new Object();
        const peopleData = require('./house_config/People.json'); 
        for (let i = 0; i < peopleData.length; i++) {   
            this.people[peopleData[i].name] = 
                new Person(this, peopleData[i].name, peopleData[i].in_room);
        }

        this.rooms = new Object(); 
        const roomsData = require('./house_config/Rooms.json');
        for (let i = 0; i < roomsData.length; i++) {
            const doors_to = new Array();
            for (let j = 0; j < roomsData[i].doors_to.length; j++)
                doors_to.push(roomsData[i].doors_to[j]);
            
            const devices = new Array();
            for (let j = 0; j < roomsData[i].devices.length; j++)
                devices.push(roomsData[i].devices[j]);

            this.rooms[roomsData[i].name] =  
                new Room(roomsData[i].name, roomsData[i].level, roomsData[i].in_people_nr, doors_to, devices);
        }
    }

    getRoomList() {
        return this.rooms;
    }

    getRoom(room) {
        for (let r in this.rooms)
            if (this.rooms[r].name == room)
                return this.rooms[r];

        return new Object();
    }

    updateRoomStatus(from, to) {
        this.getRoom(from).decreasePeopleNr();
        this.getRoom(to).increasePeopleNr();
    }

    getPersonList() {
        return this.people;
    }

    getPerson(person) {
            if (this.people[i].name == people)
                return i;

        return -1;
    }

    roomExists(room) {
        for (let r in this.rooms)
            if (this.rooms[r].name == room)
                return true;

        return false;
    }
}

module.exports = House;