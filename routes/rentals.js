const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();


Fawn.init(mongoose);

router.get('/', async (req, res) => {
    Rental.find().sort('-dateOut').exec(function (err, rentals) {
        if (err) {
            return res.status(404).send(err.message);
        }
        res.send(rentals);
    });
});

router.post('/', async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = Customer.findById(req.body.customerId, function (err, customer) {
        if (err) {
            return res.status(400).send('Invalid customer.');
        }
        return customer;
    });

    const movie = Movie.findById(req.body.movieId, function (err, movie) {
        if (err) {
            return res.status(400).send('Invalid movie.');
        }
        return movie;
    });

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    new Fawn.Task()
    .save('rentals', rental)
    .update('movies', { _id: movie._id }, {
        $inc: { numberInStock: -1 }
    }).run().then((results) => {
        console.log(results);
        res.send(rental);
    }).catch((err) => {
        res.status(500).send(`fawn try catch Something failed. ${err.message}`);
    });
});

router.get('/:id', async (req, res) => {
    Rental.findById(req.params.id, function (err, rental) {
        if (err) {
            return res.status(404).send('The rental with the given ID was not found.');
        }
        res.send(rental);
    });
});

module.exports = router; 