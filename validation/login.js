const validator = require("validator");
// Globally def func
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // We will check for the emptyness of the error to check if its valid or not

  // We will make a global function which can check for the emptyness of anything ,       it can be a string or an object

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

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

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
