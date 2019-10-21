const mongoose = require('mongoose');
const winston = require('winston')
const config = require('config');

module.exports = function() {
    const dbstring = config.get('db');
    mongoose.connect(dbstring, { useNewUrlParser: true })
        .then(() => winston.info(`Connected to MongoDB 😍😍😍... ${dbstring}`))
}