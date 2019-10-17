const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly',
    { useUnifiedTopology: true },
    { useNewUrlParser: true })
    .then(() => dbDebugger('Connected to MongoDB 😍😍😍 ...'))
    .catch(err => dbDebugger('Could not connect to MongoDB 🤎.............', err));

var Schema = mongoose.Schema;

const genreSchema = new Schema({
    name: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = new mongoose.model('Genre', genreSchema);


router.get("/", async (req, res) => {
    const genres = await Genre.find();
    res.send(genres);
});

router.get("/:id", async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send(`The genre with the id ${req.params.id} was not found`);
    res.send(genre);
});


router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body); // ES6 object distructuring feature
    if (error) return res.status(400).send(error.details[0].message); // 400 - bad request

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
});


router.put('/:id', async (req, res) => {
    // validate 
    // if invalid, return 400 - bad request
    const { error } = validateGenre(req.body); // ES6 object distructuring feature
    if (error) return res.status(400).send(error.details[0].message);

    // look up the genre 
    // if not existing, return 404 - not found
    // Update genre
    const genre = await Genre.findByIdAndUpdate(req.params.id,
        { name: req.body.name }, { new: true }
    );

     if (!genre) res.status(404).send(`The genre with the id ${req.params.id} was not found`); 
 
    // Return the updated genre
    res.send(genre);
});


router.delete('/:id', async (req, res) => {
    // look up the genre 
    // if not existing, return 404 - not found
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send(`The genre with the id ${req.params.id} was not found`)

    // return the same genre 
    res.send(genre);
});

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
}

 module.exports = router;