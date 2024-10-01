const express = require('express');
const router = express.Router();
const {productModel, validateProduct} = require('../models/product.model');
const upload = require('../config/multer_config');
const { categoryModel } = require('../models/category.model');
const {validateAdmin, userIsLoggedIn} = require('../middleware/admin.middleware');
const { cartModel } = require('../models/cart.model');

router.get("/", userIsLoggedIn, async function(req, res) {
    let somethingInCart = false;
    
    const resArray = await productModel.aggregate([
        {
            $group: {
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
    let cart = await cartModel.findOne({user: req.session.passport.user});
    if(cart && cart.products.length > 0) {
        somethingInCart = true;
    }

    //covert array to object
    const resObj = resArray.reduce((acc, item) =>{
        acc[item.category] = item.products;
        return acc;
    }, {})

    let rnproducts = await productModel.aggregate([
        {
            $sample: {
                size: 4
            }
        }
    ]);

    res.render("index", {products: resObj, rnproducts, somethingInCart, cartCount: cart ? cart.products.length: 0});
})

router.get("/delete/:id", validateAdmin, async function(req, res) {
    if(req.user.admin) {
        await productModel.findOneAndDelete({_id: req.params.id});
        return res.redirect('/admin/products');
    }
    res.send("you are not allowed to delete this product");
})

router.post("/delete", validateAdmin, async function(req, res) {
    if(req.user.admin) {
        await productModel.findOneAndDelete({_id: req.body.product_id});
        return res.redirect('back');
    }
    res.send("you are not allowed to delete this product");
})

router.post("/", upload.single("image"), async function(req, res) {
    let {name, price, category, stock, description, image} = req.body;
    let {error} = validateProduct({
        name, price, category, stock, description, image
    });
    if(error) {
        return res.send(error.message);
    }
    let isCategory = await categoryModel.findOne({name:category});
    if(!isCategory) {
        await categoryModel.create({
            name:category,
        })
    }

    let product = await productModel.create({
        name, price, category, stock, description, image:req.file.buffer
    })

    res.redirect("/admin/dashboard");
})

module.exports = router;