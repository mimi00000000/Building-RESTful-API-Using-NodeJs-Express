const express = require('express');
const router = express.Router();

const genres = [
    { id: 1, name: 'genre1' },
    { id: 2, name: 'genre2' },
    { id: 3, name: 'genre3' },
    { id: 4, name: 'genre4' }
];

router.get("/", (req, res) => {
    res.send(genres);
});

router.get("/:id", (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`The genre with the id ${req.params.id} was not found`);
    res.send(genre);
});


router.post('/', (req, res) => {
    const { error } = validateGenre(req.body); // ES6 object distructuring feature
    if (error) return res.status(400).send(error.details[0].message); // 400 - bad request

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});


router.put('/:id', (req, res) => {
    // look up the genre 
    // if not existing, return 404 - not found
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) res.status(404).send(`The genre with the id ${req.params.id} was not found`)

    // validate 
    // if invalid, return 400 - bad request
    const { error } = validateGenre(req.body); // ES6 object distructuring feature
    if (error) return res.status(400).send(error.details[0].message);

    // Update genre
    // Return the updated genre
    genre.name = req.body.name;
    res.send(genre);
});


router.delete('/:id', (req, res) => {
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

 module.exports = router;