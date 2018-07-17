// this will only deal with the authentication and all that like password etc

const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

// Load user Model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests Posts Route
// @access  Public

router.get("/test", (req, res) => {
  res.json({
    msg: "User Works"
  });
});

// @route   GET api/users/register
// @desc    To register an user
// @access  Public

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists"
      });
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

module.exports = router;
