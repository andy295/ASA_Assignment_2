const Device = require('./Device')
const Logger =  require('./Logger')

class Room {
    constructor (name, level, in_people_nr, doors_to, devices) {
        this.name = name;
        this.level = level;
        this.in_people_nr = in_people_nr;
        this.doors_to = doors_to;

        this.devices = new Object();
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
         for (let i = 0; i < devices.length; i++) {
            for(let j = 0; j < devicesData.length; j++)
            {
                if (devicesData[j].name == devices[i]) {
                    if (devicesData[j].name == 'light') {
                        this.devices[devicesData[j].name] = 
                            new Device.Light(
                                devicesData[j].name,
                                devicesData[j].status,
                                devicesData[j].movable,
                                devicesData[j].consumption);   
                    }
                    else if (devicesData[j].name == 'thermostat') {
                        this.devices[devicesData[j].name] = 
                            new Device.Thermostat(
                                devicesData[j].name,
                                devicesData[j].status,
                                devicesData[j].movable,
                                devicesData[j].consumption,
                                devicesData[j].temperature,
                                devicesData[j].work_program);
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
        for (let d in this.devices)
            if (this.devices[d].getName() == device) {
                return this.devices[d];
            }

        return '';
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
}

module.exports = Room;