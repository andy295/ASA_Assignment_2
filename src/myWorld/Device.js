const Observable =  require('../utils/Observable');
const Clock =  require('../utils/Clock');
const Logger =  require('./Logger');

class Device extends Observable {
    constructor (name, status, movable, consumption) {
        super({name: name, status: status});

        this.name = name;
        this.status = status;
        this.movable = movable;
        this.consumption = consumption;
        this.set('total_consumption', 0);
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

    getTotalConsumption() {
        return this.total_consumption;
    }

    resetTotalConsumption() {
        this.total_consumption = 0;
    }
}

class Light extends Device {
    constructor (name, status, movable, consumption) {
        super(name, status, movable, consumption);

        this.start_time = 0; // [min]
    }

    switchLightOn() {
        if (!this.getStatus()) {
            this.setStatus(true)

            let hToM = Clock.global.hh * 60;
            this.start_time = hToM + Clock.global.mm; 

            return true;
        }

        return false;
    }

    switchLightOff() {
        if (this.getStatus()) {
            this.setStatus(false)

            this.#calcConsumption();

            return true;
        }

        return false;
    }

    isLightOn() {
        return this.getStatus();
    }

    #calcConsumption() {
        let hToM = Clock.global.hh * 60;
        let end_time = hToM + Clock.global.mm;
        let elapsed_time = end_time - this.start_time;

        this.total_consumption += (elapsed_time / 60) * this.consumption 
    }
}

class Thermostat extends Device {
    #programs = ['Winter', 'Spring', 'Summer', 'Autumn'];

    constructor (name, status, movable, consumption, temperature, work_program) {
        super(name, status, movable, consumption);

        this.temperature = temperature;
        this.work_program = work_program;
        this.start_time = 0;
        this.default_temp = 21;
        this.min_temp = 3;
        this.max_temp = 3;
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

    updateTempertature() {
        this.temperature = this.#generateRandomTemp();

        if (this.temperature < this.default_temp)
            this.switchHeatingOn();
        else
            this.switchLightOff();
    }

    #generateRandomTemp() {
        let difference = 
            (this.temperature - this.min_temp) -
            (this.temperature + this.max_temp);

        let rand = Math.random();
        rand = Math.floor(rand * difference);

        rand = rand + min;

        return rand;
    }

    switchHeatingOn() {
        if (!this.isHeatingOn()) {
            this.setStatus(true)
            return true;
        }

        return false;
    }

    switchHeatingOff() {
        if (this.getStatus()) {
            this.setStatus(false)
            return true;
        }

        return false;
    }
}

module.exports = {Light, Thermostat}