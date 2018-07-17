// this will only deal with the authentication and all that like password etc

const express = require("express");
const router = express.Router();

// @route   GET api/users/test
// @desc    Tests Posts Route
// @access  Public

router.get("/test", (req, res) => {
  res.json({
    msg: "User Works"
  });
});

module.exports = router;
