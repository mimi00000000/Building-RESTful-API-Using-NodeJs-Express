const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server;

describe('/api/genres', () => {

    beforeEach(() => { server = require('../../app'); });
    afterEach(async() => { 
        server.close();
        //await Genre.deleteMany({}); 
    });

    describe('GET /', () => {
        it('Should return all genres', async  () => {
            // const genres = [
            //     { name: "genre1" },
            //     { name: "genre2" },
            //     { name: "genre3" },
            // ];
           // await Genre.collection.insertMany(genres);
            const res = await request(server).get('/api/genres');          
            expect(res.status).toBe(200);
            //expect(res.body.length).toBe(2);
            // expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
           // expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });


    describe('GET /:id', () => {
        it('Should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            //expect(res.body).toMatchObject(genre);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('Should return a 404 error if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        });
    });



    describe('POST /', () => {
        // we define the happy path,
        // and then in each test, we change one parameter 
        // that clearly aligns with the name of the test
        
        let token;
        let name;

        const exec = async () => { 
            return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name });
        }

        beforeEach(() => {        
            token = new User().genrateAuthToken();
            name = 'genre1';
        });


        it('Should return 401 if client is not logged in', async () => {
            token ='';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('Should return 400 if genre is less than 5 characters', async () => {
            name = 'gen';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('Should return 400 if genre is greater than 50 characters', async () => {
            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });
        
        // testing the happy path
        it('Should save the genre', async () => {
            const res = await exec();
            const genre = await Genre.find({ name: name });
            expect(res.status).toBe(200);
            expect(genre).not.toBeNull();
        });

        // testing the happy path
        it('Should return the saved  genre', async () => {    
            const res = await exec();       
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        });

    });

 

});
