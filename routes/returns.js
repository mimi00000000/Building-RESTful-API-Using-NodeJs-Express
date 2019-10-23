const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const moment = require('moment');
const Joi = require('joi'); // this is a class


router.post('/', auth, async (req, res) => {
  //  auth res.status(401).send('Unauthorized');
    const { error } = validateReturn(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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
        await Movie.update({_id: rental.movie._id}, 
            { $inc: { numberInStock: 1} 
        });            
        return res.send(rental);
    } 
    
});

function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()

    }
    return Joi.validate(req, schema);
}

module.exports = router;