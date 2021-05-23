const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError, AuthenticationError } = require('apollo-server');

/**
 * checks data-object for errors and throws Apollo Err if there is
 * @param data - object with err & warns
 * @param message - Message to add in the error
 */
const checkApolloErr = (value, message = 'Errors') => {
  const { errors, isValid } = value;

  if (!isValid) {
    let errorMessage = '';
    let cnt = 1;
    Object.values(errors).forEach(oneItem => {
      errorMessage = `${errorMessage}${cnt++}.${oneItem}; `;
    });
    throw new UserInputError(`${message}: ${errorMessage}`);
  }

  return false;
}

const hashPassword = async password => {
  return await bcrypt.hash(password, 10);
}

const comparePasswords = async (val1, val2) => {
  return await bcrypt.compare(val1, val2);
}

const makeToken = user => (jwt.sign({
      id: user.id,
      email: user.email,
      userName: user.userName,
    },
    process.env.SECRET_KEY,
    { expiresIn: '1h' }));


/**
 * checks header and validates user token
 * @param context
 * @return - user
 */
const checkAuthHeader = context => { // context берется из резолвера (3й параметр)
  const {authorization: authHedaer} = context.req.headers;

  if (authHedaer) {
    const token = authHedaer.split('Bearer ')[1];

    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token')
      }
    }
    throw new Error('Authentication token problems');
  }
  throw new Error('Authorization header problems');
}

module.exports = {
  checkApolloErr,
  hashPassword,
  comparePasswords,
  makeToken,
  checkAuthHeader
}
