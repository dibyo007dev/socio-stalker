const validator = require("validator");
// Globally def func
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  // We will check for the emptyness of the error to check if its valid or not

  // We will make a global function which can check for the emptyness of anything ,       it can be a string or an object

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle needs to be in between 2 and 40 characters";
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = " Profile handle is required ";
  }

  if (validator.isEmpty(data.status)) {
    errors.status = " Status is required ";
  }

  if (validator.isEmpty(data.skills)) {
    errors.skills = " Skills are required ";
  }

  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "Enter a valid URL";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "Enter a valid URL";
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "Enter a valid URL";
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = "Enter a valid URL";
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "Enter a valid URL";
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "Enter a valid URL";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
