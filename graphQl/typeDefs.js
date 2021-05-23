const gql = require('graphql-tag');

module.exports = gql`
    type Post {
        id: ID!,
        body: String!,
        createdAt: String!,
        userName: String!,
        comments: [Comment],
        likes: [Like],
        commentsCount: Int!,
        likesCount: Int!,
    }

    type User {
        id: ID!,
        email: String!,
        token: String!,
        userName: String!,
        createdAt: String!,
        password: String,
    }

    type Comment {
        id: ID!,
        createdAt: String!,
        userName: String!,
        body: String!,
    }

    type Like {
        id: ID!,
        createdAt: String!,
        userName: String!,
    }

    input RegisterInput {
        userName: String!,
        email: String!,
        password: String!,
        confirmPassword: String!,
    }

    type Query {
        testQuery: String!,
        getPosts: [Post],
        getPost(postId: ID!): Post
    }
    
    type Mutation {
        register(registerInput: RegisterInput): User,
        login(userName: String!, password: String!): User,
        createPost(body: String!): Post!,
        deletePost(postId: ID!): String!,
        createComment(postId: ID!, body: String!): Post!,
        deleteComment(postId: ID!, commentId: ID!): Post!,
        likePost(postId: ID!): Post!,
    }
    
    type Subscription {
        newPost: Post!
    }
`;
