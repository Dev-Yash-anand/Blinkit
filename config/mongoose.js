const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGOURL).then(function() {
    console.log("connected to mongodb"); 
});

module.exports = mongoose.connection;