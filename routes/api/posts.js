//  It is the landing page for the posts or Homepage

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const passport = require("passport");

// Load Post Model
const Post = require("../../models/Post");

// Load Profile Model
const Profile = require("../../models/Profile");

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

// @route   GET api/posts/:id
// @desc    Get posts by ID
// @access  Public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
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

// @route   DELETE api/posts/:id
// @desc    Delete posts by ID
// @access  Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        // Check for Post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notAuthorised: "User not authorised" });
        }
        // Delete

        Post.remove()
          .then(() => res.json({ success: true }))
          .catch(err =>
            res.status(404).json({ postNotFound: "No Post with this id" })
          );
      });
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    Like Post by ID
// @access  Private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check if user already liked the post
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyLiked: "User already liked the posts" });
          }

          // Otherwise add the user in the like array

          post.likes.unshift({
            user: req.user.id
          });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json("Post Not Found "));
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike Post by ID
// @access  Private

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check if user already liked the post
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notLiked: "You havn't liked the post yet" });
          }

          // If liked then dislike the post

          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice it out of the array

          post.likes.splice(removeIndex, 1);

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json("Post Not Found "));
    });
  }
);

module.exports = router;
