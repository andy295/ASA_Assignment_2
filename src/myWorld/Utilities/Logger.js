const fs = require("fs");
const path = require("path");


class Logger {
	
	constructor(name, dir = "./logs", cacheSize = 100) {
		this.name = name;
    
		if (!fs.existsSync(dir)) 
        	fs.mkdirSync(dir);
    
		let currentDate = new Date();
		let dateTime = currentDate.getFullYear() + '-'
			+ (currentDate.getMonth() + 1) + "-"
			+ currentDate.getDate() + "T"
			+ currentDate.getHours() + ":"
			+ currentDate.getMinutes() + ":"
			+ currentDate.getSeconds();

		this.path = path.join(dir, `${dateTime.replaceAll(':', '-').split('.')[0]}-${this.name}.log`);

    	this.cacheSize = cacheSize;
    	this.cache = []
	}

	log(level, message, logConsole = false) {
		const output = `${new Date().toISOString().replace('T',' ').split('.')[0]} ${level} ${message}`
		
		if (logConsole)
			console.log(message);

		this.cache.push(output);
    
		if (this.cache.length >= this.cacheSize) {
			fs.appendFileSync(this.path, this.cache.map(l => `${l}\n`).join(''))
			this.cache = []
		}
	}

	extractMessage(text, ...args) {

		for (let i = 0; i < args.length; i++)
			text = text + ' ' + args[i]; 

		return text;	
	}

	trace(text, ...args) {
		let message = this.extractMessage(text, ...args);
		this.log('trace', message);
	}
	
	traceConsole(text, ...args) {
		let message = this.extractMessage(text, ...args);
		this.log('trace', message, true);
	}

	error(text, ...args) {
		let message = this.extractMessage(text, ...args);
		this.log('error', message);
	}

	errorConsole(text, ...args) {
		let message = this.extractMessage(text, ...args);
		this.log('error', message, true);
	}
	
	// enable if you need them
	// info(text, ...args) {
	// 	let message = this.extractMessage(text, ...args);
	// 	this.log('info', message);
	// }

	// debug(text, ...args) {
	// 	let message = this.extractMessage(text, ...args);
    // 	this.log('debug', message);
	// }

	// warn(text, ...args) {
	// 	let message = this.extractMessage(text, ...args);
	// 	this.log('warn', message);
	// }

	fatal(text, ...args) {
		let message = this.extractMessage(text, ...args);
		this.log('fatal', message);
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

var logger = new Logger('testlogger');

module.exports = logger;