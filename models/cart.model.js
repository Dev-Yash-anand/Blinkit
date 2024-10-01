const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Cart Schema
const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    }],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    }
}, {timestamps: true});

// Joi Validation Function
function validateCart(data) {
    const schema = Joi.object({
        user: Joi.string().required(),
        products: Joi.array().items(Joi.string().required()).required(),
        totalPrice: Joi.number().min(0).required()
    });

    return schema.validate(data);
}

// Mongoose Model
const cartModel = mongoose.model("Cart", cartSchema);

module.exports = {
    cartModel,
    validateCart
};
