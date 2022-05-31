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
         for (const device of devices) {
            for(const deviceData of devicesData)
            {
                if (deviceData.name == device) {
                    if (deviceData.name == 'light') {
                        this.devices[deviceData.name] = 
                            new Light(
                                deviceData.name,
                                deviceData.status,
                                deviceData.movable,
                                deviceData.consumption);   
                    }
                    else if (deviceData.name == 'thermostat') {
                        this.devices[deviceData.name] = 
                            new Thermostat(
                                deviceData.name,
                                deviceData.status,
                                deviceData.movable,
                                deviceData.consumption,
                                deviceData.temperature,
                                deviceData.work_program);
                    }
                    else if (deviceData.name == 'vacuumCleaner') {
                        new VacuumCleaner(
                            deviceData.name,
                            deviceData.status,
                            deviceData.movable,
                            deviceData.consumption,
                            this.name);
                    }
                    break;
                }
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
            console.log(device + ' is not in ' + this.name);
            return false;
        }

        if (!devices[idx].movable) {
            console.log(device + ' cannot be removed from ' + this.name);
            return false;
        }
        
        let dev = this.#removeDevice(idx);
        to.addDevice(dev);
        console.log(device + ' moved from ' + this.name + ' to ' + to.name);
        return true;
    }

    increasePeopleNr() {
        ++this.in_people_nr;
    }

    decreasePeopleNr() {
        --this.in_people_nr;
    }

    setClean(clean) {
        this.clean = clean;
    }

    getClean() {
        return this.clean;
    }

    getType() {
        return this.type;
    }

    getCleanable() {
        return this.cleanable;
    }

    updateClean() {
        this.clean = GlobalUtilities.generateRandomValue(0, 1);
    }
}

module.exports = Room;