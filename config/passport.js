// Use of passport is to validate the JWT token

// create JWT strategy
jwtStrategy = require("passport-jwt").Strategy;

// Extract jwt
const ExtractJwt = require("passport-jwt").ExtractJwt;

// Mongoose as we are searching there
const mongoose = require("mongoose");

// Get the user model
const User = mongoose.model("users");

//Get the keys from config
const keys = require("../config/keys");

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new jwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
