const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Category Schema
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
        unique: true
    }
}, {timestamps: true});

// Joi Validation Function
function validateCategory(data) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).required()
    });

    return schema.validate(data);
}

// Mongoose Model
const categoryModel = mongoose.model("Category", categorySchema);

module.exports = {
    categoryModel,
    validateCategory
};
