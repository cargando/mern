const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const { checkAuthHeader } = require('../../utils');

module.exports = {
  Mutation: {
    createComment: async (parent, args, context, info) => {
      const {postId, body} = args;

      const user = checkAuthHeader(context);

      if (body.trim() === '') {
        throw new UserInputError('Empty comment')
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          userName: user.userName,
          createdAt: new Date().toISOString(),
        });

        await post.save();

        return post;
      } else {
        throw new UserInputError('Post doesn\' exist');
      }

    },

    deleteComment: async (parent, args, context, info) => {
      const { postId, commentId } = args;

      const user = checkAuthHeader(context);

      const post = await Post.findById(postId);

      console.log("POST: ", post);

      if (post) {
        const commentIndex = post.comments.findIndex(item => item.id === commentId);

        if (commentIndex < 0) {
          throw new UserInputError('No such comment');
        }

        if (post.comments[commentIndex].userName === user.userName) {
          post.comments.splice(commentIndex, 1);

          await post.save();
          return post;
        } else {
          throw new AuthenticationError('You don\'t have permission for this action');
        }
      } else {
        throw new UserInputError('No such post');
      }


    },
  }
}
