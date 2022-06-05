const Observable = require('../../../utils/Observable');


class Device extends Observable {
    constructor (name, status, movable, consumption) {
        super({name: name, status: status});

        this.name = name;
        this.status = status;
        this.movable = movable;
        this.consumption = consumption;
        this.total_consumption = 0;
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

module.exports = Device;