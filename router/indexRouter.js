const express = require('express');
const router = express.Router();
const {productModel} = require('../models/product.model');

router.get("/", async function(req, res) {
    res.redirect("/products");
})

module.exports = router;