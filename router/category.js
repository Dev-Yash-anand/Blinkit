const express = require('express');
const router = express.Router();
const { categoryModel } = require('../models/category.model');
const {validateAdmin} = require('../middleware/admin.middleware');

router.post("/create", validateAdmin, async function(req, res) {
    let category = await categoryModel.create({
        name: req.body.name,
    })

    res.redirect('back');
})

module.exports = router;