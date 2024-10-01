const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Product Schema
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false,
        maxlength: 1024
    },
    image: {
        type: Buffer,
    }
}, {timestamps: true});

// Joi Validation Function
function validateProduct(data) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().required(),
        stock: Joi.number().required(),
        description: Joi.string().max(1024).optional(),
        image: Joi.string().optional(),
    });

    return schema.validate(data);
}

// Mongoose Model
const productModel = mongoose.model("product", productSchema);

module.exports = {
    productModel,
    validateProduct
};
