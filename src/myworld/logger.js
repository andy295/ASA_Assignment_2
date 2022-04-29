const fs = require("fs");
const path = require("path");

class Logger {
	constructor(name, dir = "./logs", cacheSize = 100) {
		this.name = name;
    
		if (!fs.existsSync(dir)) 
        	fs.mkdirSync(dir);
    
		this.path = path.join(dir,
			`${new Date().toISOString().replaceAll(':', '-').split('.')[0]}
        	-${this.name}.log`);
    
    	this.cacheSize = cacheSize;
    	this.cache = []
	}

	log(level, message) {
		const output = `${new Date().toISOString().replace('T',' ').split('.')[0]} ${this.name} ${level} ${message}`
		console.log(output);
		this.cache.push(output);
    
		if (this.cache.length >= this.cacheSize) {
			fs.appendFileSync(this.path, this.cache.map(l => `${l}\n`).join(''))
			this.cache = []
		}
	}

	info(message) {
		this.log('info', message)
	}

	debug(message) {
    	this.log('debug', message)
	}

	trace(message) {
		this.log('trace', message)
	}
	
	warn(message) {
		this.log('warn', message)
	}
	
	error(message) {
		this.log('error', message)
	}
	
	fatal(message) {
		this.log('fatal', message)
	}

	close() {
		fs.appendFileSync(this.path, this.cache.map(l => `${l}\n`).join(''))
	}
}

// how to use
// after you have instantiate a logger object you can call it
// by using the logger.(type) function as showed below
// 
// logger.info('App started');
// logger.debug('Event START triggered');
// logger.warn('THING Deprecated');
// logger.error('Logging is too cool');
// logger.fatal('App crashed because of X, Y and Z');


module.exports = Logger;