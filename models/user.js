const mongoose = require('mongoose');
const Joi = require('joi'); // this is a class
const jwt = require('jsonwebtoken');
const config = require('config');


var Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
        unique: true
    },
    isAdmin: Boolean
    // roles: []
    // operations: []
});

userSchema.methods.genrateAuthToken = function() {
    return jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin },
         config.get('jwtPrivateKey')
    );
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(50).required()
    };
    return Joi.validate(user, schema);
}

// Role based authorization 


module.exports.User = User;
module.exports.validateUser = validateUser;
