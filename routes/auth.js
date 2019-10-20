// ES6 
//  Array/Object Destructuring
// Example :
// const alphabet = ['A', 'B', 'C', 'D', 'E', 'F']
// const numbers = [1, 2, 3, 4, 5];
// const [a, b, c] = alphabet;
// console.log(a); // A
// console.log(b); // B
// console.log(c); // C
// const [a, , c, ...rest] = alphabet;
// console.log(rest); //  ['D', 'E', 'F']

// concat() using  Array/Object Destructuring
// const newArray = alphabet.concat(numbers);
// const newArray = [...alphabet, ...numbers];

// function sumAndMultiply(a, b) {
//    return [a+b, a*b];
// }

// const array = sumAndMultiply(2, 3);
// const [sum , mult, division = 'No division'] =  sumAndMultiply(2, 3);
// console.log(sum);
// console.log(mult);
// division = 'No division' default value in array destructuring


// destructuring objects
// firstname is for renaming
// sconst { age, name: firstname } = personInfo
// nesting { address: { city }} = personInfo;
// overiding an object
// const personThree = {...personOne, ...personTwo}

// function printUser({ name, age, favoriteFood = 'Watermelon'}) {
//     console.log(`name is : ${name}. Age is ${age}. Food is ${favoriteFood}`)
// }
// printUser(personOne);
const Joi = require('joi'); // this is a class
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');

// npm i jsonwebtoken


router.post('/', async (req, res) => {
    const { error } = validateAuth(req.body); // ES6 object distructuring feature
    if (error) return res.status(400).send(error.details[0].message); // 400 - bad request

    let user = await User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            return;
        }
        return user;
    });

    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) {
        return res.status(400).send('Invalid email or password.');
    } else {
        // need to return a json web token 
        // we genrate a jwt for the client
        // the client send it back too the server
        // header payload(the json object the client sent) digital signature 
       // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
        const token = user.genrateAuthToken();
        res.send(token);
    }
});

// the object who has Information Expert Principale

function validateAuth(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(50).required()
    };
    return Joi.validate(req, schema);
}



module.exports = router;