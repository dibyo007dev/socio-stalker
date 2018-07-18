// WIll have things like bio, location, and other descriptions
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const passport = require("passport");

// Load Profile Model
const Profile = require("../../models/Profile");

// Load User Model
const User = require("../../models/User");

//------------------ Load Validation ------------------//
const validateProfileInput = require("../../validation/profile");
//-----------------------------------------------------//

// @route   GET api/profile/test
// @desc    Tests Posts Route
// @access  Public

router.get("/test", (req, res) => {
  res.json({
    msg: "User Profile Works"
  });
});

// @route   GET api/profile
// @desc    Get current users' profile
// @access  Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noProfile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/handle/:handle          // Its a backend api route it gets hit by the frontend
// @desc    Get Profile by handle
// @access  Public

// router.get("/handle/:handle", (req, res) => {
//   const errors = {};
//   Profile.findOne({
//     handle: req.params.handle
//   })
//     .populate("user", ["name", "avatar "])
//     .then(profile => {
//       if (!profile) {
//         errors.noProfile = "There is no profile for this user ";
//         res.status(400).json(errors);
//       }
//     });
// });

// @route   POST api/profile
// @desc    Create or Update current users profile
// @access  Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get validation func
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      res.status(404).json(errors);
    }
    // Get Feilds
    const profileFeilds = {};

    profileFeilds.user = req.user.id;
    if (req.body.handle) profileFeilds.handle = req.body.handle;
    if (req.body.company) profileFeilds.company = req.body.company;
    if (req.body.website) profileFeilds.website = req.body.website;
    if (req.body.location) profileFeilds.location = req.body.location;
    if (req.body.status) profileFeilds.status = req.body.status;
    if (req.body.bio) profileFeilds.bio = req.body.bio;
    if (req.body.githubusername)
      profileFeilds.githubusername = req.body.githubusername;

    // Skills - split into array
    if (typeof req.body.skills !== "undefined") {
      profileFeilds.skills = req.body.skills.split(",");
    }

    // Social - initialize first
    profileFeilds.social = {};

    if (req.body.youtube) profileFeilds.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFeilds.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFeilds.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFeilds.social.instagram = req.body.instagram;
    if (req.body.linkedin) profileFeilds.social.handle = req.body.handle;

    // Check if user is present then update else create a new one

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFeilds },
          { new: true }
        )
          .then(profile => res.json(profile))
          .catch(err => res.status(400).json(err));
      } else {
        //Create

        // Check if handle exists
        Profile.findOne({ handle: req.user.handle }).then(profile => {
          if (profile) {
            errors.handle = "Handle already exists";
            res.status(400).json(errors);
          }

          // Save profile
          new Profile(profileFeilds).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

module.exports = router;
