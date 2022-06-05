const GlobalUtilities = require('../../Utilities/GlobalUtilities');
const Device = require('./Device');
const logger = require('../../Utilities/Logger');

class SolarPanel extends Device {
    constructor (name, status, movable, production) {
        super(name, status, movable, 0);

        // production => kWh
        this.production = production;
        this.totalProduction = 0;
        this.tollerance = 25;
    }

    updateProcuction() {
        let produced = this.#calcConsumption();
        logger.traceConsole('House: solar panels have produced: ' + produced + ' kW');

        this.totalProduction += this.#calcConsumption();
    }

    getTotalProduction() {
        return this.totalProduction;
    }

    resetTotalProduction() {
        this.totalProduction = 0;
    }

    #calcConsumption(start_time) {
        let range = this.production * this.tollerance / 100;
        let min = this.production - range;
        let max = this.production + range;

        return GlobalUtilities.getRandomFloat(min, max, 3); 
    }
}

module.exports = SolarPanel;