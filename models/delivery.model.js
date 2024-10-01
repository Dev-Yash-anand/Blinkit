const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Delivery Schema
const deliverySchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    deliveryBoy: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'shipped', 'out for delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    trackingUrl: {
        type: String,
    },
    estimatedDeliveryTime: {
        type: Number,
        required: true,
        min: 0
    }
}, {timestamps: true});

// Joi Validation Function
function validateDelivery(data) {
    const schema = Joi.object({
        order: Joi.string().required(),
        deliveryBoy: Joi.string().min(2).max(100).required(),
        status: Joi.string().valid('pending', 'shipped', 'out for delivery', 'delivered', 'cancelled').required(),
        trackingUrl: Joi.string().uri(),
        estimatedDeliveryTime: Joi.number().min(0).required()
    });

    return schema.validate(data);
}

// Mongoose Model
const deliveryModel = mongoose.model("Delivery", deliverySchema);

module.exports = {
    deliveryModel,
    validateDelivery
};
