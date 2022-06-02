const GlobalUtilities = require('../Utilities/GlobalUtilities');
const Person = require('./Person');
const Room = require('./Room');
const houseAgent = require('../Agents/House/HouseAgent');
const vacuumCleanerAgents = require('../Agents/VacuumCleaner/VacuumCleanerAgent');

class House {

    constructor (houseAgent, deviceAgents) {

        this.rooms = {};
        this.#initRooms(houseAgent, deviceAgents);

        this.people = {};
        this.#initPeople(houseAgent)
    }
    
     #initRooms(houseAgent, deviceAgents) {

        const roomsData = require('./house_config/Rooms.json');
        for (const room of roomsData) {

            // initialize every room into the house
            const doors_to = new Array();
            for (const to of room.doors_to)
                doors_to.push(to);
            
            const devices = new Array();
            for (const device of room.devices)
                devices.push(device);

            this.rooms[room.name] =  
                new Room(room.name,
                    room.level,
                    doors_to,
                    room.cleanable,
                    room.type,
                    devices);

            // create beliefs for the house agent
            houseAgent.beliefs.declare('is_' + room.type +
                ' ' + room.name);
         
            for (const to of doors_to) {
                // console.log('connected ' +
                // room.name +
                // ' ' + to);

                houseAgent.beliefs.declare('connected ' +
                room.name +
                ' ' + to);
            }

            this.#setCleaning(room, houseAgent, deviceAgents);
        }
    }

    #setCleaning(room, houseAgent, deviceAgents) {

        if (room.cleanable) {
            if (this.rooms[room.name].isClean())
                houseAgent.beliefs.declare('clean ' + room.name);
            else
                houseAgent.beliefs.declare('dirty ' + room.name);

            for (const deviceAgent of deviceAgents) {
                if (deviceAgent.getType() == 'vacuumCleaner' && 
                    deviceAgent.getOperationLevel() == room.level) {
                    deviceAgent.setCleanTime(room);
                    break;
                }
            }
        }

        if (room.devices.includes('vacuumCleaner')) {
            for (const deviceAgent of deviceAgents) {
  
                if (deviceAgent.getType() == 'vacuumCleaner' && 
                    deviceAgent.getOperationLevel() == room.level) {

                    deviceAgent.setDevice(this.rooms[room.name].getDevice(deviceAgent.getType()));
                    if(GlobalUtilities.isValidObj(deviceAgent.getDevice())) {
                        houseAgent.beliefs.declare('in ' + deviceAgent.getName() + ' ' + room.name);
                        houseAgent.beliefs.declare('is_robot '+ deviceAgent.getName());
                        break;
                    }
                }
            }
        }
    }

    #initPeople(houseAgent) {
        
        const peopleData = require('./house_config/People.json'); 
        for (const person of peopleData) {   
            this.people[person.name] = 
                new Person(this, person.name, person.in_room);

            this.rooms[person.in_room].increasePeopleNr();

            if (!houseAgent.beliefs.check('people_in_' + person.in_room))
                houseAgent.beliefs.declare('people_in_' + person.in_room);
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

const house = new House(houseAgent, vacuumCleanerAgents);

module.exports = house;