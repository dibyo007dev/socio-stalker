const validator = require("validator");
// Globally def func
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  // We will check for the emptyness of the error to check if its valid or not

  // We will make a global function which can check for the emptyness of anything ,       it can be a string or an object

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "Job title feild is required ";
  }
  if (validator.isEmpty(data.company)) {
    errors.company = " Company feild is required ";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "From date feild is required ";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
