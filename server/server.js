const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const {typeDefs, resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth');
const db = require('./config/connection');
const path = require('path');
const routes = require('./routes');

// Express server
const app = express();
const PORT = process.env.PORT || 3001;
// Apollo server
const startServer = async () => {
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    // context: authMiddleware 
  });

  // Start the Apollo server
  await server.start();

  // Apply Apollo server to Express server as middleware
  server.applyMiddleware({ app });

  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

  // Initialize the Apollo server
  startServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    
  });
});