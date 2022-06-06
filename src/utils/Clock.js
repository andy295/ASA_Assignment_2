const Observable =  require('./Observable');
const {DaysEnum, MonthsEnum} = require('../myWorld/Utilities/Calendar');
const readline = require('readline');

/**
 * @static {global} is the global time
 * @static {startTimer()} method start the timer loop
 * 
 * Note that mm, hh, and dd are updated one at a time!
 * However, Observable handle observer callbacks in microtask queues, so that,
 * at the time observers are actually called, both mm, hh, and dd should all been up-to-date!
 */
class Clock {

    /** @type {Observable} {dd, hh, mm} */
    static global = new Observable({dd: 0, hh: 0, mm: 0});

    static format() {
        var time = Clock.global;
        let day = Object.keys(DaysEnum).find(k => DaysEnum[k] === time.dd);
        return '' + day + ' ' + (time.hh < 10 ? '0' : '') + time.hh + ':' + (time.mm < 10 ? '0' : '') + time.mm;
    }

    static #start = true;

    static async stopTimer() {
        Clock.#start = false;
    }

    static async startTimer() {

        Clock.#start = true

        while(Clock.#start) {
            await new Promise(res => setTimeout(res, 50))
            
            var {dd, hh, mm} = Clock.global;
            
            if (mm <= 55)
                Clock.global.mm += 5;
            else {
                if (hh < 23) {
                    Clock.global.hh += 1; // increased hh but mm still 45
                    Clock.global.mm = 0; // however, observers are handled as microtask so at the time they are called everything will be sync
                }
                else {
                    Clock.global.mm = 0;
                    Clock.global.hh = 0;
                    Clock.global.dd += 1;
                }
            }

            if (dd < 7) {
                // Here, time is logged immediately before any other observable gets updated!
                readline.cursorTo(process.stdout, 0);
                process.stdout.write(Clock.format() + '\t');
            }
            else
                readline.cursorTo(process.stdout, 0);
        }
    }
}

module.exports = Clock