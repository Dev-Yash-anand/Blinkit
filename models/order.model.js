const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Order Schema
const orderSchema = mongoose.Schema({
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
    },
    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery",
        required: true
    }
}, {timestamps: true});

// Joi Validation Function
function validateOrder(data) {
    const schema = Joi.object({
        user: Joi.string().required(),
        products: Joi.array().items(Joi.string().required()).required(),
        totalPrice: Joi.number().min(0).required(),
        address: Joi.string().min(5).max(255).required(),
        status: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled').required(),
        payment: Joi.string().required(),
        delivery: Joi.string().required()
    });

    return schema.validate(data);
}

// Mongoose Model
const orderModel = mongoose.model("Order", orderSchema);

module.exports = {
    orderModel,
    validateOrder
};
