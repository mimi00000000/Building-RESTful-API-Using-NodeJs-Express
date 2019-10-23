const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Rental, validateRental } = require('../models/rental');
const moment = require('moment');


router.post('/', auth, async (req, res) => {
  //  res.status(401).send('Unauthorized');
    if(!req.body.customerId) {
      res.status(400).send('Bad request customerId is not provided');
    } else if (!req.body.movieId) {
        res.status(400).send('Bad request movieId is not provided');
    } else {
        const rental = await Rental.findOne({
            'customer._id': req.body.customerId,
            'movie._id': req.body.movieId,
        });
        if (!rental) {
            return res.status(404).send('Rental not found');
        } else if(rental.dateReturned) {
            return res.status(400).send('Return already processed');
        } else {
            rental.dateReturned = new Date();
            const rentalDays = moment().diff(rental.dateOut, 'days');
            rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
            await rental.save();
            return res.status(200).send('request is valid');
        }
    }
});


module.exports = router;