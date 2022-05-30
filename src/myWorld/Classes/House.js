const Person = require('./Person');
const Room = require('./Room');

class House {
    constructor (houseAgent) {
        this.rooms = new Object();
        this.#initRooms(houseAgent);

        this.people = new Object();
        this.#initPeople(houseAgent)
    }

    #initRooms(houseAgent) {
        const roomsData = require('./house_config/Rooms.json');
        for (let i = 0; i < roomsData.length; i++) {

            // initialize every room into the house
            const doors_to = new Array();
            for (let j = 0; j < roomsData[i].doors_to.length; j++)
                doors_to.push(roomsData[i].doors_to[j]);
            
            const devices = new Array();
            for (let j = 0; j < roomsData[i].devices.length; j++)
                devices.push(roomsData[i].devices[j]);

            this.rooms[roomsData[i].name] =  
                new Room(roomsData[i].name,
                    roomsData[i].level,
                    doors_to,
                    roomsData[i].clean,
                    roomsData[i].type,
                    devices);

            // create beliefs for the house agent
            houseAgent.beliefs.declare('is_' + roomsData[i].type +
                ' ' +  roomsData[i].name +
                ' ' + roomsData[i].level);

            if (roomsData[i].clean)
                houseAgent.beliefs.declare('clean ' + roomsData[i].name);
            else
                houseAgent.beliefs.declare('dirty ' + roomsData[i].name);
            
            doors_to.forEach(function (room) {
                // console.log('connected ' +
                // roomsData[i].name +
                // ' ' + room);

                houseAgent.beliefs.declare('connected ' +
                roomsData[i].name +
                ' ' + room);
            });

            if (devices.includes('vacuum_cleaner')) {
                if (roomsData[i].level == 0) {
                    houseAgent.beliefs.declare('in gfvc ' + roomsData[i].name);
                    houseAgent.beliefs.declare('is_robot gfvc');
                }
                else {
                    houseAgent.beliefs.declare('in ffvc ' + roomsData[i].name);
                    houseAgent.beliefs.declare('is_robot ffvc');
                }
            }
        }
    }

    #initPeople(houseAgent) {
        const peopleData = require('./house_config/People.json'); 
        for (let i = 0; i < peopleData.length; i++) {   
            this.people[peopleData[i].name] = 
                new Person(this, peopleData[i].name, peopleData[i].in_room);

            this.rooms[peopleData[i].in_room].increasePeopleNr();

            if (!houseAgent.beliefs.check('people_in_' + peopleData[i].in_room))
                houseAgent.beliefs.declare('people_in_' + peopleData[i].in_room);
        }
    }

    getRoomList() {
        return this.rooms;
    }

    getRoom(room) {
        if (this.rooms[room])
            return this.rooms[room];

        return new Object();
    }

    updateRoomStatus(from, to) {
        if (this.rooms[from])
            this.rooms[from].decreasePeopleNr();
        
        if (this.rooms[to])
            this.rooms[to].increasePeopleNr();
    }

    getPersonList() {
        return this.people;
    }

    roomExists(room) {
        if (this.rooms[room])
            return true;

        return false;
    }

    setClean(room) {
        if (this.rooms[room])
			this.rooms[room].setClean(true);
    }

    setDirty(room) {
        if (this.rooms[room])
        this.rooms[room].setClean(false);
    }
}

module.exports = House;