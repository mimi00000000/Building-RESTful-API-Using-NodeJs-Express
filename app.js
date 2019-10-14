// Basic requires imports for NodeJs App
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // for cross-orign requests
const Joi = require('joi'); // this is a class

// Create an instance of all the imports
const app = module.exports = express();
app.use(bodyParser.json());
app.use(cors());

const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3' },
    { id: 4, name: 'course4' }
];

// your first API endpoint... 
app.get("/api/hello",  (req, res) => {
    res.json({ greeting: 'hello API' });
});


app.get("/api/courses",  (req, res) => {
    res.send(courses);
});

app.get("/api/courses/:id",  (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)   return  res.status(404).send(`The course with the id ${req.params.id} was not found`);
    res.send(course);
});


app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body); // ES6 object distructuring feature
    if (error) return  res.status(400).send(error.details[0].message); // 400 - bad request
        
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});


app.put('/api/courses/:id', (req, res) => {
    // look up the course 
    // if not existing, return 404 - not found
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send(`The course with the id ${req.params.id} was not found`)

    // validate 
    // if invalid, return 400 - bad request
    const { error } = validateCourse(req.body); // ES6 object distructuring feature
    if (error)  return res.status(400).send(error.details[0].message);

    // Update course
    // Return the updated course
    course.name = req.body.name;
    res.send(course);
});


app.delete('/api/courses/:id', (req, res) => {
    // look up the course 
    // if not existing, return 404 - not found
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send(`The course with the id ${req.params.id} was not found`)

    // Delete 
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // return the same course 
    res.send(course);
});  

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

// the last thing to do
//to set the env variable use the command set PORT = 5000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});