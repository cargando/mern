/**
 * helper - creats an object with errors&warnings and isValid fields
 * @param errors
 * @param warnings
 * @return {{warnings: {}, isValid: boolean, errors: {}}}
 */
const returnHelper = (errors = {}, warnings = {}) => {
  return {
    errors,
    warnings,
    isValid: Object.keys(errors).length < 1
  };
}

/**
 * validate & check user password strength
 * @param value - user password to verify
 * @return - +2 excelent, 1 good, 0 bad
 */
const validatePasswordStrength = (value) => {
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");


  if(strongRegex.test(value)) {
    return 2;
  } else if(mediumRegex.test(value)) {
    return 1;
  }
  return 0;
}

/**
 * validates email
 * @param value
 * @return - true/false
 */
const validateEmail = (value) => {
  const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
  return value.match(regEx);
}

/**
 * validate user login and password not to be empty
 * @param login
 * @param password
 * @return {{warnings: {}, isValid: boolean, errors: {}}}
 */
const validateLoginInput = (login, password) => {
  const errors = {};
  if (login.trim() === '') {
    errors.userName = 'Please input a user name (should not be empty)';
  }
  if (password.trim() === '') {
    errors.password = 'Please input a password. (should not be empty)';
  }
  return returnHelper(errors);
}

/**
 * validate users data prior to register new user
 * @param userName
 * @param email
 * @param password
 * @param confirmPassword
 * @return {{warnings: {}, isValid: boolean, errors: {}}}
 */
const validateUserRegisterData = (
  userName,
  email,
  password,
  confirmPassword,
) => {
  const errors = {};
  const warnings = {};

  if (userName.trim() === '') {
    errors.userName = 'Please specify a user name (should not be empty)';
  }

  if (email.trim() === '') {
    errors.email = 'Please specify an email (should not be empty)';
  } else {

    if (!validateEmail(email)) {
      errors.email = 'Email must be a valid email address';
    }
  }

  if (password.trim() === '') {
    errors.password = 'Please input password. (should not be empty)';
  } else {
    const pwdStrength = validatePasswordStrength(password);
    if (!pwdStrength) {
      errors.password = 'Password is not strong enough (should contain at least one digit, one alpha and one special char)';
    } else if (pwdStrength === 1) {
      warnings.password = 'Password strength is medium';
    }
  }

  if (password !== confirmPassword) {
    errors.password = 'Passwords are not the same';
  }

  return returnHelper(errors, warnings);
}

module.exports = {
  validatePasswordStrength,
  validateEmail,
  validateUserRegisterData,
  validateLoginInput
};
