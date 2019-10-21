const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    ]
});