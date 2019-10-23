// POST /api/returns { customerId, movieId }

// Return 401 Unauthorized if the client is not logged in
// Return 400 Bad Request if customerId is not provided
// Return 400 Bad Request movieId is not provided
// return 404 not found if no rental found for this customer/movie
// Return 400 Bad request if rental already processed
// Return 200 if valid request
// set the return date
// calculate the rental fee
// increase the stock
// return the rental
const moment = require('moment');
const request = require('supertest');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
mongoose = require('mongoose');


describe('/api/returns', () => {
    let server;
    let customerId;
    let rental;
    let token; 
    let movie;

    const exec = () => {
       return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    }

    beforeEach( async () => { 
        server = require('../../app');      
        token = new User().genrateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId(); 

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: 'amovieTitle',
                dailyRentalRate: 2
            }
        });
        await rental.save();

        movie = new Movie({
            _id : movieId,
            title: 'amovieTitle',
            dailyRentalRate: 2,
            genre: { name: '12345'},
            numberInStock : 10
        });
        await movie.save();
    });

    afterEach(async () => {
        await server.close();
        await Rental.deleteMany({}); 
    });


    it('should return 401 Unauthorized if client is not logged in!', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental is found for customer/movie', async () => {
        await Rental.deleteMany({}); 
        const res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 400 if return is already processed', async () => {
       rental.dateReturned = new Date(); 
       await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if we have a valid request', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });


    it('should set the returnDate if input is valid', async () => {       
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10*1000);
    });

    it('should set the returnfee if input is valid', async () => {
        // dateOut (current time)
        // dateOut 7 days ago
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });

});