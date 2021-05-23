const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const { checkAuthHeader } = require('../../utils');
const { NEW_POST } = require('./const');

module.exports = {
  Query: {
    testQuery: () => 'test response',

    getPosts: async () => {
      try {
        const posts = await Post.find().sort({createdAt: -1}); // сортировка по полю createdAt
        console.log('POSTS: ', posts)
        return posts;
      } catch (err) {
        console.log(`ERR: Shit load on Posts ${err}`);
      }
    },

    getPost: async (parent, args, context, info) => {
      const { postId } = args;

      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },

  Mutation: {
      createPost: async (parent, args, context, info) => {
        const { body } = args;
        const user = checkAuthHeader(context);

        if (body.trim() === '') {
          throw new UserInputError('Post is empty');
        }

        const newPost = new Post({ // данные по схеме из модели Post
          body,
          user: user.id,
          userName: user.userName,
          createdAt: new Date().toISOString(),
        });

        const post = await newPost.save();

        // публикация уведомления для подписчиков о том, что создан пост
        await context.pubSub.publish(NEW_POST, {
          newPost: post, // this is a payload, property name - from the Subscriptions in typeDefs.js
        })

        return post;

      },

    deletePost: async (parent, args, context, info) => {
      const { postId } = args;
      const user = checkAuthHeader(context);

      try {
        const post = await Post.findById(postId);
        if (post.userName === user.userName) {
          await post.delete();
          return 'Deleted successfully';
        } else {
          throw new AuthenticationError('You can\'t delete this post');
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    likePost: async (parent, args, context, info) => {
      const { postId } = args;

      const user = checkAuthHeader(context);

      const post = await Post.findById(postId);

      if (post) {
        if (post.likes.find(item => item.userName === user.userName)) { // у поста уже есть лайк, нужно дизлайкнуть
          post.likes = post.likes.filter(item => item.userName !== user.userName)
        } else { // post не имеет лайка, нужно лайкнуть
          post.likes.push({
            userName: user.userName,
            createdAt: new Date().toISOString(),
          })
        }

        await post.save();

        return post;

      } else {
        throw new UserInputError('No such post');
      }
    }
  },

  Subscription: { // в GraphQL можно подписаться на какие-то события в рамках реализованных резолверов
    newPost: {
      // subscribe: (parent, args, context, info) - неиспользуемые аргументы обычно просто игнорируют, или заменяют на подчеркивания
      // так же можно сразу деструктурировать, например context
      subscribe: (_, __, { pubSub }) => pubSub.asyncIterator(NEW_POST),
    }
  }
};
