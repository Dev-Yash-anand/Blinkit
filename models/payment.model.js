const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Payment Schema
const paymentSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    method: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true});

// Joi Validation Function
function validatePayment(data) {
    const schema = Joi.object({
        order: Joi.string().required(),
        method: Joi.string().required(),
        amount: Joi.number().min(0).required(),
        status: Joi.string().required(),
        transactionId: Joi.string().required()
    });

    return schema.validate(data);
}

// Mongoose Model
const paymentModel = mongoose.model("Payment", paymentSchema);

module.exports = {
    paymentModel,
    validatePayment
};
