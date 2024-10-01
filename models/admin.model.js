const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Admin Schema
const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'superadmin']
    }
}, {timestamps: true});

// Joi Validation Function
function validateAdmin(data) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        password: Joi.string().min(6).max(255).required(),
        email: Joi.string().email().required(),
        role: Joi.string().valid('admin', 'superadmin').required()
    });

    return schema.validate(data);
}

module.exports = {
    adminModel: mongoose.model("Admin", adminSchema),
    validateAdmin
};
