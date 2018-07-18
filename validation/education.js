const validator = require("validator");
// Globally def func
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  // We will check for the emptyness of the error to check if its valid or not

  // We will make a global function which can check for the emptyness of anything ,       it can be a string or an object

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.feildofstudy = !isEmpty(data.feildofstudy) ? data.feildofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.school)) {
    errors.school = "School Name is required ";
  }
  if (validator.isEmpty(data.degree)) {
    errors.degree = " Degree feild is required ";
  }
  if (validator.isEmpty(data.feildofstudy)) {
    errors.feildofstudy = " Feild of study feild is required ";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "From date feild is required ";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
