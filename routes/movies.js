const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const router = express.Router();


router.get("/", async (req, res) => {
    Movie.find(function (err, movies) {
        if (err) {
            return res.status(404).send(err.message);
        }
        res.send(movies);
    });
});

router.get("/:id", async (req, res) => {
    // const movie = await Movie.findById(req.params.id);
    Movie.findById(req.params.id, function (err, movie) {
        if (err) {
            return res.status(404).send(`The movie with the id ${req.params.id} was not found`);
        }
        res.send(movie);
    });
});


router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body); // ES6 object distructuring feature
    if (error) return res.status(400).send(error.details[0].message); // 400 - bad request

    const genre = await Genre.findById(req.body.genreId, function (err, genre) {
        if (err) {
            return res.status(404).send(`The genre with the id ${req.body.genreId} was not found`);
        }
        return genre;
    });

    let movie = new Movie({ 
        title: req.body.title,
        genre:  {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    movie = await movie.save();
    res.send(movie);
});


router.put('/:id', async (req, res) => {
    // validate 
    // if invalid, return 400 - bad request
    const { error } = validateMovie(req.body); // ES6 object distructuring feature
    if (error) return res.status(400).send(error.details[0].message);

    const genre = Genre.findById(req.body.genreId, function (err, genre) {
        if (err) {
            return res.status(404).send(`The genre with the id ${req.body.genreId} was not found`);
        }
        return genre;
    });
    
    // look up the movie 
    // if not existing, return 404 - not found
    // Update movie
    await Movie.findByIdAndUpdate(req.params.id,
        { title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate }, { new: true }, function (err, movie) {
            if (err) {
                if (!movie) res.status(404).send(`The movie with the id ${req.params.id} was not found`);
            }
            // Return the updated movie
            res.send(movie);
        });
});


router.delete('/:id', async (req, res) => {
    // look up the movie 
    // if not existing, return 404 - not found
    await Movie.findByIdAndDelete(req.params.id, function (err, movie) {
        if (err) {
            if (!movie) return res.status(404).send(`The movie with the id ${req.params.id} was not found`);
        }
        // return the same movie 
        res.send(movie);
    });

});


module.exports = router; 