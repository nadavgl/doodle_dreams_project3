require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cookieParser = require('cookie-parser');
const { verify } = require('jsonwebtoken');
const path = require('path');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');

const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3333;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start();

  app.use(
    '/graphql',
    // cors(), 
    express.json(),
    cookieParser(),
    expressMiddleware(server, {
      context: ({ req, res }) => {
        const token = req.cookies.token;
        let user_id = null;

        if (token) {
          try {
            const { user_id: id } = verify(token, process.env.JWT_SECRET);

            user_id = id;
          } catch (error) {
            console.log('token verification error', error);
          }
        }

        return {
          user_id,
          req,
          res
        }
      }
    })
  );

  if (process.env.PORT) {
    app.use(express.static('../client/dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    })
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log('Express server running on port', PORT);
      console.log('GraphQL ready at /graphql');
    });
  });
}

startServer();