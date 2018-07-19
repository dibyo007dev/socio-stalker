const validator = require("validator");
// Globally def func
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  // We will check for the emptyness of the error to check if its valid or not

  // We will make a global function which can check for the emptyness of anything ,       it can be a string or an object

  data.text = !isEmpty(data.text) ? data.text : "";

  if (validator.isEmpty(data.text)) {
    errors.text = "Text feild is required ";
  }

  if (!validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Post must be between 10 and 300 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
