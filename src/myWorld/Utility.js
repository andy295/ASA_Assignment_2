const Logger =  require('./Logger');

class Utility {
    constructor (name, consumption) {
        this.name = name;
        this.consumption = consumption;
    }

    getName() {
        return this.name;
    }

    getConsumption() {
        return this.value;
    }

    updateConsumption(value) {
        this.value += value;
    }
}

module.exports = Utility