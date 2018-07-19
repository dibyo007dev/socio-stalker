//  It is the landing page for the posts or Homepage

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const passport = require("passport");

// Load Post Model
const Post = require("../../models/Post");

//------------------ Load Validation ------------------//
const validatePostInput = require("../../validation/post");

//-----------------------------------------------------//

// @route   GET api/posts/test
// @desc    Tests Posts Route
// @access  Public

router.get("/test", (req, res) => {
  res.json({
    msg: "Posts Works"
  });
});

// @route   GET api/posts
// @desc    Fetch posts
// @access  Public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(err));
});

// @route   POST api/posts
// @desc    Create Posts
// @access  Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check for Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

module.exports = router;
