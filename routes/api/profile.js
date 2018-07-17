// WIll have things like bio, location, and other descriptions
const express = require("express");
const router = express.Router();

// @route   GET api/profile/test
// @desc    Tests Posts Route
// @access  Public

router.get("/test", (req, res) => {
  res.json({
    msg: "User Profile Works"
  });
});

module.exports = router;
