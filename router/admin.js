const express = require('express');
const router = express.Router();
const {adminModel} = require("../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { valid } = require('joi');
const {validateAdmin} = require('../middleware/admin.middleware');
const { productModel } = require('../models/product.model');
const { categoryModel } = require('../models/category.model');
require("dotenv").config();

if(
    typeof process.env.NODE_ENV !== undefined &&
    process.env.NODE_ENV ===  "DEVELOPMENT"
) {
    router.get("/create", async function(req, res) {
        try {
            let salt = await bcrypt.genSalt(12);
            let hash = await bcrypt.hash("admin", salt);

            let user = new adminModel({
                name: "Yash Anand",
                password: hash,
                email: "admin@blinkit.com",
                role: "admin"
            })

            await user.save();

            let token = jwt.sign({email: "admin@blinkit.com", admin: true}, process.env.JWT_SECRET);
            res.cookie("token", token);
            res.send("admin created successfully");
        } catch (error) {
            res.send(error.message);
        }
    })
}

router.get("/login", function(req, res) {
    res.render("admin_login");
})

router.post("/login",async function(req, res) {
    let { email, password } = req.body;
    let admin = await adminModel.findOne({email});
    if(!admin) {
        return res.send("Credentials are incorrect!!!");
    }

    let validPass = await bcrypt.compare(password, admin.password);
    if(validPass) {
            let token = jwt.sign({email: "admin@blinkit.com", admin: true}, process.env.JWT_SECRET);
            res.cookie("token", token);
            res.redirect("/admin/dashboard");
    }else{
        res.send("Credentials are incorrect!!!")
    }
})

router.get("/dashboard", validateAdmin, async function(req, res) {
    let count1 = await productModel.countDocuments();
    let count2 = await categoryModel.countDocuments();
    res.render("admin_dashboard", {count1, count2});
})

router.get("/products", validateAdmin, async function(req, res) {
    const resArray = await productModel.aggregate([
        {$group: {
            _id: "$category",
            products: { $push : "$$ROOT"},
        },
    },
    {
        $project: {
            _id: 0,
            category: "$_id",
            products: { $slice: ["$products", 10]}
        },
    }
    ])

    //covert array to object
    const resObj = resArray.reduce((acc,  item) =>{
        acc[item.category] = item.products;
        return acc;
    }, {})

    res.render("admin_products", {products: resObj});
})

router.get("/logout", validateAdmin, function(req, res) {
    res.cookie("token", "");
    res.redirect("/admin/login");
})

module.exports = router;