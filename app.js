const express = require('express');
const app = express();
const indexRouter = require('./router/indexRouter')
const authRouter = require('./router/auth')
const productRouter = require('./router/product')
const adminRouter = require('./router/admin')
const userRouter = require('./router/user')
const cartRouter = require('./router/cart')
const categoryRouter = require('./router/category')
const path = require("path");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require('passport');

require('dotenv').config();
require("./config/mongoose");
require("./config/passport");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret: process.env.SESSION_SECRET
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/user", userRouter);
app.use("/cart", cartRouter);

app.listen(3000);