const GlobalUtilities = require('../Utilities/GlobalUtilities');
const Observable = require('../../utils/Observable');
const Device = require('./Devices/Device');
const Light = require('./Devices/Light');
const Thermostat = require('./Devices/Thermostat');
const VacuumCleaner = require('./Devices/VacuumCleaner');
const RollUpShutter = require('./Devices/RollUpShutter');
const logger = require('../Utilities/Logger');

class Room extends Observable {
    constructor (name, level, doors_to, cleanable, type, devicesName) {
        super({name: name})
        this.name = name;
        this.level = level;
        this.in_people_nr = 0;
        this.doors_to = doors_to;
        this.cleanable = cleanable;
        this.type = type;

        this.set('clean', true);

        this.devices = {};
        this.#generateDeviceList(devicesName);
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

    #generateDeviceList(devicesName) {
        
        const devicesData = require('./house_config/Devices.json');
        for (const name of devicesName) {
            for (const dev of devicesData) {
                if (name == dev.name) {

                    switch (name) {
                        case 'light':
                            this.devices[dev.name] = 
                            new Light(
                                dev.name,
                                dev.status,
                                dev.movable,
                                dev.consumption);   
                        break;
                        case 'thermostat':
                            this.devices[dev.name] = 
                                new Thermostat(
                                    dev.name,
                                    dev.status,
                                    dev.movable,
                                    dev.consumption,
                                    dev.temperature,
                                    dev.work_program);
                        break;
                        case 'vacuumCleaner':
                            this.devices[dev.name] = 
                                new VacuumCleaner(
                                    dev.name,
                                    dev.status,
                                    dev.movable,
                                    dev.consumption,
                                    this.name);
                        break;
                        case 'roll_up_shtr_win':
                        case 'roll_up_shtr_door':
                        {
                            if (!this.devices.hasOwnProperty(dev.globalName)) {
                                let list = [];
                                this.devices[dev.globalName] = list;
                            }
                                                    
                            let list = this.devices[dev.globalName];
                                                    
                            let rollUpShutter =
                                new RollUpShutter(
                                    dev.globalName,
                                    dev.status,
                                    dev.movable,
                                    dev.consumption,
                                    dev.type);
                                                        
                            list.push(rollUpShutter);
                        }
                        break;
                        default:
                        break;
                    }

                    break;
                }
            }
        }
    }

    addDevice(device) {
        if (this.devices.hasOwnProperty(device.getName())) {
            logger.errorConsole(device.getName() + ' cannot be added to ' + this.name);
            return false;
        }

        if (typeof device.getCopy == "undefined") { 
            logger.errorConsole(device.getName() + ' has not copy method');
            return false;
        }

        this.devices[device.getName()] = device.getCopy(this.name); 
        return true;
    }

    #removeDevice(device) {
        if (this.devices.hasOwnProperty(device.getName()))
            delete this.devices[device.getName()];
    }

    getdevicesName() {
        return this.doors_to;
    }

    getDevice(device) {
        if (this.devices[device])
            return this.devices[device];

        return new Object();
    }

    getDeviceList() {
        return this.devices;
    }

    moveDeviceTo (devName, roomTo) {
        
        let device = this.getDevice(devName);
        if (!GlobalUtilities.isValidObj(device)) {
            logger.errorConsole('Device not found in ' + this.name);
            return false;
        }

        if (!device.isMovable()) {
            logger.errorConsole(device.getName() + ' cannot be removed from ' + this.name);
            return false;
        }
        
        if (!roomTo.addDevice(device))
            return false;

        this.#removeDevice(device);

        logger.traceConsole('House:', device.getName() + ' moved from ' + this.name + ' to ' + roomTo.getName());
        
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