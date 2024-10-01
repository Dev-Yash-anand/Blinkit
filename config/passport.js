var GoogleStrategy = require('passport-google-oauth20').Strategy;
const {userModel} = require('../models/user.model');
const passport = require("passport");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      let user = await  userModel.findOne({email: profile.emails[0].value});

      if(!user) {
        user = new userModel({
            name: profile.displayName,
            email: profile.emails[0].value
        });

        await user.save();
        
      }
      cb(null, user);
    } catch (error) {
        cb(err, false);
    }
  }
));

passport.serializeUser(function(user, cb) {
    return cb(null, user._id);//this will save the data that is user id
})

passport.deserializeUser(async function(id, cb) { // this will share id on every route
    let user = await userModel.findOne({_id: id});
    cb(null, user);
});

module.exports = passport;