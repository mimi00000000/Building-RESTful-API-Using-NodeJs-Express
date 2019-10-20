const { Genre, validateGenre } = require('../models/genre');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.get("/", async (req, res, next) => {    
    Genre.find(function (err, genres) {
        if(err) {
            // something failed
            // 500 Internal Server Error
            console.log('something failed, 500 Internal Server Error');
            next(err);
        }
        res.send(genres);
    })
});

router.get("/:id", async (req, res) => {
    // const genre = await Genre.findById(req.params.id);
    Genre.findById(req.params.id, function (err, genre) { 
        if(err) {
            return res.status(404).send(`The genre with the id ${req.params.id} was not found`);
        }
        res.send(genre);
    });
});


router.post('/', auth, async (req, res) => {
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
    await Genre.findByIdAndUpdate(req.params.id, 
        { name: req.body.name }, { new: true }, function (err, genre) {
            if(err) {
                if (!genre) res.status(404).send(`The genre with the id ${req.params.id} was not found`); 
            }
            // Return the updated genre
            res.send(genre);
        }); 
});

// [auth, admin] authentification and authorization middlewares 
router.delete('/:id', [auth, admin], async (req, res) => {
    // look up the genre 
    // if not existing, return 404 - not found
    await Genre.findByIdAndDelete(req.params.id, function(err, genre) {
        if(err) {
            if (!genre) return res.status(404).send(`The genre with the id ${req.params.id} was not found`);
        }
        // return the same genre 
        res.send(genre);
    });

});


 module.exports = router;