const Validator = require("validator");
const isEmpty = require("is-empty");

function ValidateProfileInput(data) {
  let errors = {};
  // Convert empty field to an empty string
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  (data.lastName = !isEmpty(data.lastName) ? data.lastName : ""),
    (data.gender = !isEmpty(data.gender) ? data.gender : ""),
    (data.email = !isEmpty(data.email) ? data.email : ""),
    (data.birthDate = !isEmpty(data.birthDate) ? data.birthDate : ""),
    (data.phone = !isEmpty(data.phone) ? data.phone : ""),
    (data.address = !isEmpty(data.address) ? data.address : ""),
    (data.rate = !isEmpty(data.rate) ? data.rate : ""),
    (data.description = !isEmpty(data.description) ? data.description : "");

  // firstName checks
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "First name is required";
  }

  // firstName check
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Last name is required";
  }

  // gender check
  if (Validator.isEmpty(data.gender)) {
    errors.gender = "Gender is required";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // birthDate check
  if (Validator.isEmpty(data.birthDate)) {
    errors.birthDate = "Birth Date is required";
  }

  // phone check
  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Phone number is required";
  }

  // address check
  if (Validator.isEmpty(data.address)) {
    errors.address = "Address is required";
  }

  // rate check
  // using String here beacuse Validator only accepts strings
  let rateString = data.rate.toString();
  if (Validator.isEmpty(rateString)) {
    errors.rate = "Hourly rate is required";
  } else if (!Validator.isNumeric(rateString)) {
    errors.rate = "Please enter number";
  }

  // description check
  if (Validator.isEmpty(data.description)) {
    errors.description = "Description is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

module.exports = ValidateProfileInput;
