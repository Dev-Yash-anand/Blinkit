const express = require('express');
const { userIsLoggedIn } = require('../middleware/admin.middleware');
const userModel = require('../models/user.model');
const {cartModel} = require('../models/cart.model');
const { productModel } = require('../models/product.model');
const router = express.Router();

router.get('/', userIsLoggedIn, async function(req, res) {
    let cart = await cartModel.findOne({user: req.session.passport.user}).populate("products");
    let cartDs = {};
    cart.products.forEach((product)=> {
        let key = product._id.toString();
        if(cartDs[key]){
            cartDs[key].quantity += 1;
        } else {
            cart[key] = {
                ...product._doc,
                quantity: 1
            }
        }
    })
    let finalarray = Object.values(cartDs);
    let finalprice = cart.totalPrice + 34;
    res.render("cart", {cart:finalarray, finalprice: finalprice});
});

router.get('/add/:id', userIsLoggedIn, async function(req, res) {
    try {
        let cart = await cartModel.findOne({user: req.session.passport.user});
        let product = await productModel.findOne({_id: req.params.id});

        if(!cart) {
            cart = await cartModel.create({
                user: req.session.passport.user,
                products: [req.params.id],
                totalPrice: Number(product.price)
            });
        } else {
            cart.products.push(req.params.id);
            cart.totalPrice = Number(cart.totalPrice) + Number(product.price);
            await cart.save();
        }

        res.redirect("back");
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/remove/:id', userIsLoggedIn, async function(req, res) {
    try {
        let cart = await cartModel.findOne({user: req.session.passport.user});
        let product = await productModel.findOne({_id: req.params.id});

        if(!cart) {
            res.send("there is nothing in your cart")
        } else {
            let prodId = cart.products.indexOf(req.params.id);
            cart.products.splice(prodId, 1);
            cart.totalPrice = Number(cart.totalPrice) - Number(product.price);
            await cart.save();
        }

        res.redirect("back");
    } catch (error) {
        res.send(error.message);
    }
})

router.get("/remove/:id", userIsLoggedIn, async function(req, res) {
    try {
        if (!req.session.passport || !req.session.passport.user) {
        return res.status(401).send("User is not logged in");
    }

    let cart = await cartModel.findOne({ user: req.session.passport.user });

    if (!cart) {
        return res.send({
            products: [],
            totalPrice: 0,
            message: "No cart found for this user."
        });
    }

    let idx = cart.products.indexOf(req.params.id);
    if (idx !== -1) {
        let product = await productModel.findOne({ _id: req.params.id });
        cart.products.splice(idx, 1);
        cart.totalPrice = Number(cart.totalPrice) - Number(product.price);

        // Ensure totalPrice is not negative
        if (cart.totalPrice < 0) {
            cart.totalPrice = 0;
        }
    }

    // If the cart is empty, reset totalPrice to 0
    if (cart.products.length === 0) {
        cart.totalPrice = 0;
    }

    await cart.save();
    res.redirect("back");
    } catch (error) {
        res.send(error.message);
    }
})

module.exports = router;