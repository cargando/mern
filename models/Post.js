const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  body: String,
  userName: String,
  createdAt: Date,
  modifiedAt: Date,
  comments: [
    {
      body: String,
      userName: String,
      createdAt: Date,

    }
  ],
  likes: [
    {
      userName: String,
      createdAt: Date,
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  }
});

module.exports = model('Post', postSchema);
