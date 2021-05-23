const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  userName: String,
  password: String,
  email: String,
  createdAt: Date,
  modifiedAt: Date,
});

module.exports = model('User', userSchema);
