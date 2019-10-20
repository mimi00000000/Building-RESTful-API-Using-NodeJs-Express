const mongoose = require('mongoose');
const winston = require('winston');
const dbDebugger = require('debug')('app:db');


module.exports = function() {
    mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
        .then(() => dbDebugger('Connected to MongoDB 😍😍😍 ...'))
        .catch(err => dbDebugger('Could not connect to MongoDB 🤎.............', err));
}