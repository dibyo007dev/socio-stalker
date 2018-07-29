// this will only deal with the authentication and all that like password etc

const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

// For recieving JWT on successful Auth
const jwt = require("jsonwebtoken");

// Get the secret key from config file
const key = require("../../config/keys");

// Load user Model
const User = require("../../models/User");

// For making protected route
const passport = require("passport");

//------------------ Load Validation ------------------//
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//-----------------------------------------------------//

// @route   GET api/users/test
// @desc    Tests Posts Route
// @access  Public

router.get("/test", (req, res) => {
  res.json({
    msg: "User Works"
  });
});

// @route   POST api/users/register
// @desc    To register an user
// @access  Public

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url("emerleite@gmail.com", {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" //  Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      // Adding a record with avatar (gravatar is used)

      // Password is being hashed using bcrypt

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;

  const password = req.body.password;

  User.findOne({ email }).then(user => {
    // Check User
    errors.email = "User Not found";
    if (!user) return res.status(404).json(errors);

    // Check Password

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        // Create JWT payload
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };
        // Assign a JWT (sign jwt)
        jwt.sign(
          payload,
          key.secretOrKey,
          {
            expiresIn: 3600
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password Incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return the current user
// @access  Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    });
  }
);

module.exports = router;
