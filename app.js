//  DEBUG=app:* nodemon app.js
// 1 Basic requires imports for NodeJs App
const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const cors = require('cors'); // for cross-orign requests
const Joi = require('joi'); // this is a class
// third-party middleware to secure the app by setting various http headers
const helmet = require('helmet');
// morgan module for logging purposes


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
const dbDebugger = require('debug')('app:db');
const debug = require('debug')('app:starting');


const logger = require('./middleware/logger');
const authentication = require('./middleware/authentication');

const genres = require('./routes/genres');
const home = require('./routes/home');

// 2 Create an instance of all the imports

// express instance
const app = module.exports = express(); 

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


// Configuration
debug('Application name : '+ config.get('name'));
debug('Mail Server : ' + config.get('mail.host'));
//get the pass from environment variable for the mail server password 
// debug('Mail Password : ' + config.get('mail.password'));


// not in production just in development
if(app.get('env') === 'development') {
    app.use(morgan('tiny')); // it is a function morgan();
    debug('Morgan enabled...');
}

// to serve static files
// http://localhost:3000/readme.txt
app.use(express.static('public'));
app.use(cors());

// custom middelware in a seperate module
app.use(logger);
app.use(authentication);


// 3 routes handler

app.use('/api/genres', genres);
app.use('/', home);



// 4 the last thing to do
//to set the env variable use the command set PORT = 5000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    debug(`listening on port ${port}`);
});