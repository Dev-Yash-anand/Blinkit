const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Address Schema
const AddressSchema = mongoose.Schema({
    state: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    zip: {
        type: Number,
        required: true,
        min: 10000,
        max: 999999 // assuming 5 digit zip code
    },
    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }
});

// Mongoose User Schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 255
    },
    phone: {
        type: Number,
        minlength: 10,
        maxlength: 15,
        match: /^[0-9]{10}$/,
    },
    addresses: [AddressSchema]
}, {timestamps: true});

// Joi Validation Function
function validateUser(data) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(255).required(),
        phone: Joi.number().min(1000000000).max(999999999999999).required(),
        addresses: Joi.array().items(Joi.object({
            state: Joi.string().min(2).max(50).required(),
            city: Joi.string().min(2).max(50).required(),
            zip: Joi.number().min(10000).max(999999).required(),
            address: Joi.string().min(5).max(255).required()
        }))
    });

    return schema.validate(data);
}

module.exports = {
    userModel: mongoose.model("user", userSchema),
    validateUser
};
