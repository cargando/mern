require('dotenv').config();

const { ApolloServer, PubSub} = require('apollo-server');
const mongoose = require('mongoose');
// const { MONGODB } = require('./db/config');

const typeDefs = require('./graphQl/typeDefs');
const resolvers = require('./graphQl/resolvers');

const pubSub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubSub }), // context, передается в резолверы (3й параметр)
});

mongoose.connect(process.env.MONGODB, { useUnifiedTopology: true, useNewUrlParser: true})
  .then(() => {
    console.log(`\n- - - - - - \nConnected to MongoDB.Atlas\n`);
    return server.listen({port: 1001});
  })
  .then((res) => {
    console.log(`Server is up at ${res.url}`);
  }).catch((err) => {
    console.log(`ERROR: Shit load ${err}`);
});
