const GlobalUtilities = require('../Utilities/GlobalUtilities');
const Observable = require('../../utils/Observable');
const Light = require('./Devices/Light');
const Thermostat = require('./Devices/Thermostat');
const VacuumCleaner = require('./Devices/VacuumCleaner');

class Room extends Observable {
    constructor (name, level, doors_to, cleanable, type, devices) {
        super({name: name})
        this.name = name;
        this.level = level;
        this.in_people_nr = 0;
        this.doors_to = doors_to;
        this.cleanable = cleanable;
        this.type = type;

        this.set('clean', true);

        this.devices = {};
        this.#generateDeviceList(devices);
    }

    getName() {
        return this.name;
    }
    
    getLevel() {
        return this.level;
    }

    getDoorsToList() {
        return this.doors_to;
    }

    getDoorsTo(doors_to) {
        for (let i = 0; i < this.doors_to.length; i++)
            if (this.doors_to[i] == doors_to)
                return i;

        return -1;
    }

    #generateDeviceList(devices) {
        
        const devicesData = require('./house_config/Devices.json');
        let cases = [];
        for(let i = 0; i < devicesData.length; i++) {
            cases[i] = devicesData[i].name; 
        }

        for (const device of devices) {
            switch(device) {
                case cases[0]:
                    this.devices[devicesData[0].name] = 
                        new Light(
                            devicesData[0].name,
                            devicesData[0].status,
                            devicesData[0].movable,
                            devicesData[0].consumption);   
                break;
                case cases[1]:
                    this.devices[devicesData[1].name] = 
                    new Thermostat(
                        devicesData[1].name,
                        devicesData[1].status,
                        devicesData[1].movable,
                        devicesData[1].consumption,
                        devicesData[1].temperature,
                        devicesData[1].work_program);
                break;
                case cases[2]:
                    this.devices[devicesData[2].name] =
                    new VacuumCleaner(
                        devicesData[2].name,
                        devicesData[2].status,
                        devicesData[2].movable,
                        devicesData[2].consumption,
                        this.name);
                break;
                default:
                    break; 
            } 
        }
    }

    addDevice(device) {
        this.devices.push(device);
    }

    #removeDevice(idx) {

        var device = devices.splice(idx, 1);
        return device;
    }

    getDevicesList() {
        return this.doors_to;
    }

    getDevice(device) {
        if (this.devices[device])
            return this.devices[device];

        return new Object();
    }

    moveDeviceTo (device, to) {
        let idx = this.getDevice(device);
        if (idx == -1) {
            this.error(device + ' is not in ' + this.name);
            return false;
        }

        if (!devices[idx].movable) {
            this.error(device + ' cannot be removed from ' + this.name);
            return false;
        }
        
        let dev = this.#removeDevice(idx);
        to.addDevice(dev);
        this.error(device + ' moved from ' + this.name + ' to ' + to.name);
        return true;
    }

    getInPeopleNr() {
        return this.in_people_nr; 
    }

    increasePeopleNr() {
        ++this.in_people_nr;
    }

    decreasePeopleNr() {
        --this.in_people_nr;
    }

    setClean(v) {
        this.clean = v;
    }

    isClean() {
        return this.clean;
    }

    getType() {
        return this.type;
    }

    isCleanable() {
        return this.cleanable;
    }

    updateClean() {
        this.clean = 
        GlobalUtilities.generateRandomValue(0, 1) ?
            true : false;
    }
}

module.exports = Room;