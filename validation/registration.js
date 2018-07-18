const validator = require("validator");
// Globally def func
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // We will check for the emptyness of the error to check if its valid or not

  // We will make a global function which can check for the emptyness of anything ,       it can be a string or an object

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirm_password = !isEmpty(data.confirm_password)
    ? data.confirm_password
    : "";

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (validator.isEmpty(data.name)) {
    errors.name = "Name feild is required ";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email feild is required ";
  }

  if (validator.isEmail(data.email)) {
    errors.email = "Email is invalid ";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password feild is required ";
  }

  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be atleast 6 characters";
  }

  if (validator.isEmpty(data.confirm_password)) {
    errors.confirm_password = "Password feild is required ";
  }

  if (!validator.equals(data.password, data.confirm_password)) {
    errors.confirm_password = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
