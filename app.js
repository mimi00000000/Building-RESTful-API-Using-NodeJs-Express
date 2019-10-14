// Basic requires imports for NodeJs App
const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const cors = require('cors'); // for cross-orign requests
const Joi = require('joi'); // this is a class
// third-party middleware to secure the app by setting various http headers
const helmet = require('helmet');
//
const morgan = require('morgan');

const logger = require('./middleware/logger');
const authentication = require('./middleware/authentication');


// Create an instance of all the imports
const app = module.exports = express();


// environment 
// if not set returns 
// set NODE_ENV=production
console.log(`NODE_ENV: ${process.env.NODE_ENV}`); // undefines
console.log(`app: ${app.get('env')}`); // default value development

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
console.log('Application name : '+ config.get('name'));
console.log('Mail Server : ' + config.get('mail.host'));
//get the pass from environment variable for the mail server password 
//console.log('Mail Password : ' + config.get('mail.password'));


// not in production just in development
if(app.get('env') === 'development') {
    app.use(morgan('tiny')); // it is a function morgan();
    console.log('Morgan enabled...');
}

// to serve static files
// http://localhost:3000/readme.txt
app.use(express.static('public'));
app.use(cors());

// custom middelware in a seperate module
app.use(logger);
app.use(authentication);

const genres = [
    { id: 1, name: 'genre1' },
    { id: 2, name: 'genre2' },
    { id: 3, name: 'genre3' },
    { id: 4, name: 'genre4' }
];

// your first API endpoint...
// route handler is also a middleware 
app.get("/api/hello",  (req, res) => {
    res.json({ greeting: 'hello API' });
});


app.get("/api/genres",  (req, res) => {
    res.send(genres);
});

app.get("/api/genres/:id",  (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre)   return  res.status(404).send(`The genre with the id ${req.params.id} was not found`);
    res.send(genre);
});


app.post('/api/genres', (req, res) => {
    const { error } = validateGenre(req.body); // ES6 object distructuring feature
    if (error) return  res.status(400).send(error.details[0].message); // 400 - bad request
        
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});


app.put('/api/genres/:id', (req, res) => {
    // look up the genre 
    // if not existing, return 404 - not found
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) res.status(404).send(`The genre with the id ${req.params.id} was not found`)

    // validate 
    // if invalid, return 400 - bad request
    const { error } = validateGenre(req.body); // ES6 object distructuring feature
    if (error)  return res.status(400).send(error.details[0].message);

    // Update genre
    // Return the updated genre
    genre.name = req.body.name;
    res.send(genre);
});


app.delete('/api/genres/:id', (req, res) => {
    // look up the genre 
    // if not existing, return 404 - not found
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`The genre with the id ${req.params.id} was not found`)

    // Delete 
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    // return the same genre 
    res.send(genre);
});  

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
}

// the last thing to do
//to set the env variable use the command set PORT = 5000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});