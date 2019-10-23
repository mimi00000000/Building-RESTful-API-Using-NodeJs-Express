
const express = require('express');
const returns = require('../routes/returns');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const home = require('../routes/home');
const rentals = require('../routes/rentals');
const movies = require('../routes/movies');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function (app){
    app.use(express.json());
    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/returns', returns);
    app.use('/', home);
    app.use(error);
}