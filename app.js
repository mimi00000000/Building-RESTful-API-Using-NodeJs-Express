//  DEBUG=app:* nodemon app.js
// 1 Basic requires imports for NodeJs App
const winston = require('winston');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // for cross-orign requests
// third-party middleware to secure the app by setting various http headers
const helmet = require('helmet');
// to view only the startup debugging
// set DEBUG=app:startup
// set DEBUG=app:db
// to view nothing 
// set DEBUG=
// to view all the debug infos 
// set DEBUG=app:startup,app:db
// or
// set DEBUG=app:*
// DEBUG=app:db nodemon app.js 
const debug = require('debug')('app:starting');
// express instance
const app = module.exports = express(); 


// morgan module for logging purposes
const morgan = require('morgan');

app.set('view engine', 'pug');
app.set('views', './views'); // default


// environment 
// if not set returns 
// set NODE_ENV=production
debug(`NODE_ENV: ${process.env.NODE_ENV}`); // undefines
debug(`app: ${app.get('env')}`); // default value development

/* a middleware or a middleware function,
a middleware is basically a function that takes a req object  
and either return the res to the client
 or passes control to another middleware function.  */
 // Example a json middleware (parses the request body to json object) and  route handler 
 // request processing pipeline
// this is a middleware 
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true})); // key=value&key=value
app.use(helmet()); // it is a function helmet();



// not in production just in development
if(app.get('env') === 'development') {
    app.use(morgan('tiny')); // it is a function morgan();
    debug('Morgan enabled...');
}

// to serve static files
// http://localhost:3000/readme.txt
app.use(express.static('public'));
app.use(cors());


// Authentication
// Authorization
// Register: POST /api/users
// Login: POST /api/logins


// routes  db logging middleware
require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();

// 4 the last thing to do
//to set the env variable use the command set PORT = 5000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    debug(`listening on port ${port}`);
});

// testing library frameworks
// Jasmine
// Mocha (Chai, Sinon)
// Jest (personal choice)

