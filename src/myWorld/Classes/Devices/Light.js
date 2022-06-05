const Device = require('./Device');
const Clock = require('../../../utils/Clock');


class Light extends Device {
    constructor (name, status, movable, consumption) {
        super(name, status, movable, consumption);

        // consumption => kWh

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

        this.totalConsumption += (elapsed_time / 60) * this.consumption;
    }
}

module.exports = Light;