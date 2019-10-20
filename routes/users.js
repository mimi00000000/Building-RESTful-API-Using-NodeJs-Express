const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validateUser } = require('../models/user');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
// npm i lodash
// npm i bcrypt

router.get("/", async (req, res) => {
    User.find(function (err, users) {
        if (err) {
            return res.status(404).send(err.message);
        }
        res.send(users);
    })
});

// provide a token header
router.get("/me", auth, async (req, res) => {
    // const user = await User.findById(req.params.id);
    User.findById(req.user._id, function (err, user) {
        if (err) {
            return res.status(404).send(`The user with the id ${req.params.id} was not found`);
        }
        res.send(_.pick(user, ['_id', 'name', 'email']));
    });
});


router.post('/', async (req, res) => {
    const { error } = validateUser(req.body); // ES6 object distructuring feature
    if (error) return res.status(400).send(error.details[0].message); // 400 - bad request

    let user = await User.findOne({ email: req.body.email}, function(err, user) {
        if(err) {
            return;
        }
        return user;
    });

    if (user) return res.status(400).send('User already registered.');

    // user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password 
    // });
    user = new User(_.pick(req.body, ['name', 'email', 'password']))
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
    const token = user.genrateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});


router.put('/:id', async (req, res) => {
    // validate 
    // if invalid, return 400 - bad request
    const { error } = validateUser(req.body); // ES6 object distructuring feature
    if (error) return res.status(400).send(error.details[0].message);

    // look up the user 
    // if not existing, return 404 - not found
    // Update user
    await User.findByIdAndUpdate(req.params.id,
        { name: req.body.name }, { new: true }, function (err, user) {
            if (err) {
                if (!user) res.status(404).send(`The user with the id ${req.params.id} was not found`);
            }
            // Return the updated user
            res.send(_.pick(user, ['_id', 'name', 'email']));
        });
});


router.delete('/:id',async (req, res) => {
    // look up the user 
    // if not existing, return 404 - not found
    await User.findByIdAndDelete(req.params.id, function (err, user) {
        if (err) {
            if (!user) return res.status(404).send(`The user with the id ${req.params.id} was not found`);
        }
        // return the same user 
        res.send(_.pick(user, ['_id', 'name', 'email']));
    });

});

// logging out users
// we don't need to log out users because we do not store their tokens


module.exports = router;