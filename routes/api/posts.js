//  It is the landing page for the posts or Homepage

const express = require("express");
const router = express.Router();

// @route   GET api/posts/test
// @desc    Tests Posts Route
// @access  Public

router.get("/test", (req, res) => {
  res.json({
    msg: "Posts Works"
  });
});

module.exports = router;
