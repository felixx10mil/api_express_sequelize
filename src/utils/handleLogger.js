import { createLogger, format, transports, config } from 'winston';
// const DailyRotateFile = require('winston-daily-rotate-file');

const customLevels = {
	levels: {
		critical: 0,
		error: 1,
		warn: 2,
		info: 3,
		debug: 4,
	},
	colors: {
		critical: 'red',
		error: 'red',
		warn: 'yellow',
		info: 'green',
		debug: 'blue',
	},
};

const logger = createLogger({
	levels: customLevels.levels,
	level: 'info', // Set the default log level
	format: format.combine(
		format.colorize({ all: true }),
		format.timestamp(),
		format.printf(
			({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
		),
	),
	transports: [
		new transports.Console(),
		new transports.File({
			maxsize: 5120000,
			maxFiles: 3,
			filename: `${__dirname}/../storage/logs/api.log`,
		}),
	],
});

module.exports = logger;
