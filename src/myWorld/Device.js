const Observable =  require('../utils/Observable')
const Logger =  require('./Logger')

class Device extends Observable {
    constructor (name, status, movable, consumption) {
        super({name: name, status: status });

        this.name = name;
        this.status = status;
        this.movable = movable;
        this.consumption = consumption; 
    }

    getName() {
        return this.name;
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }

    isMovable() {
        return this.movable;
    }

    getConsumption() {
        return this.consumption;
    }
}

class Light extends Device {
    constructor (name, status, movable, consumption) {
        super(name, status, movable, consumption);
    }

    switchLightOn() {
        if (!this.getStatus()) {
            this.setStatus(true)
            return true;
        }

        return false;
    }

    switchLightOff() {
        if (this.getStatus()) {
            this.setStatus(false)
            return true;
        }

        return false;
    }

    isLightOn() {
        return this.getStatus();
    }
}

class Thermostat extends Device {
    #programs = ['Winter', 'Spring', 'Summer', 'Autumn'];

    constructor (name, status, movable, consumption, temperature, work_program) {
        super(name, status, movable, consumption);

        this.temperature = temperature;
        this.work_program = work_program;
    }

    getWorkProgramName(prog_nr) {
        return this.#programs[prog_nr];
    }

    getWorkProgramName() {
        return getWorkProgramName(this.work_program);
    }

    getProgramNr() {
        return this.work_program;
    }

    setProgram(idx) {
        this.work_program = idx;
        console.log(this.#programs[idx] + ' set up');   
    }

    getTemperature() {
        return this.temperature;
    }

    setTemperature(temperature) {
        this.temperature = temperature; 
    }

    isHeatingOn() {
        return this.getStatus();
    }
}

module.exports = {
    Light : Light,
    Thermostat : Thermostat
}