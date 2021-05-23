const { UserInputError } = require('apollo-server');
const { validateUserRegisterData, validateLoginInput } = require('../utils/validators');
const {
  checkApolloErr,
  hashPassword,
  comparePasswords,
  makeToken
} = require('../../utils');
const User = require('../../models/User');


// parent - предыдущий резолвер. данные могут проходить через несколько резолверов (цепочка)
// args - аргументы, переданные из тайпдефа (input RegisterInput)
module.exports = {
  Mutation: {
    login: async (parent, args, context, info) => {
      const { userName, password } = args;

      checkApolloErr(validateLoginInput(userName, password));
      const user = await User.findOne({userName: {$eq: userName}});

      if (!user) {
        throw new UserInputError(`There is no such user name '${userName}'`);
      }
console.log("PWD>>> ", password, user);
      const passwordsCmp = await comparePasswords(password, user.password)
      if (!passwordsCmp) {
        throw new UserInputError(`Wrong password`);
      }

      const token = makeToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    register: async (parent, args, context, info) => {
      const {registerInput: { userName, email, password, confirmPassword}} = args;


      // check if user already exists
      // query find operators https://docs.mongodb.com/manual/reference/operator/query-comparison/
      const user = await User.findOne({userName: {$eq: userName}});
      // console.log('>> USER: ', userName, user);

      if (user) {
        throw new UserInputError(`The user name '${userName}' already taken`);
      }

      checkApolloErr(validateUserRegisterData(userName, email, password, confirmPassword), 'Data Validation Errors');


      // register new user

      const hashedPwd = await hashPassword(password);
      console.log('PWD>>> ', hashedPwd, password)
      const newUser = new User({
        userName,
        email,
        password: hashedPwd,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = makeToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    }
  }
}
