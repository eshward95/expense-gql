// The ApolloServer constructor requires two parameters: your schema

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import connectMongo from "connect-mongodb-session";
import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";
import session from "express-session";
import { buildContext } from "graphql-passport";
import http from "http";
import passport from "passport";
import path from "path";
import { connectDB } from "./db/connectDb.js";
import { configurePassport } from "./passport/passport.config.js";
import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

const __dirname = path.resolve();

configDotenv();
configurePassport();
// console.log("Starting", process.env.MONGO_URI);
// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);
const mongoStore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
mongoStore.on("error", function (err) {
  console.log(err);
});

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false, // this option specifies whether to save the session to the store on every request
    saveUninitialized: false, // option specifies whether to save uninitialized sessions
    store: mongoStore,
    cookie: {
      maxAge: 1000 * 60 * 24 * 24 * 7,
    },
  })
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

/**
 * Notice that these middlewares are initialized after the `express-session` middleware.  This is because
 * Passport relies on the `express-session` middleware and must have access to the `req.session` object.
 *
 * passport.initialize() - This creates middleware that runs before every HTTP request.  It works in two steps:
 *      1. Checks to see if the current session has a `req.session.passport` object on it.  This object will be
 *
 *          { user: '<Mongo DB user ID>' }
 *
 *      2.  If it finds a session with a `req.session.passport` property, it grabs the User ID and saves it to an
 *          internal Passport method for later.
 *
 * passport.session() - This calls the Passport Authenticator using the "Session Strategy".  Here are the basic
 * steps that this method takes:
 *      1.  Takes the MongoDB user ID obtained from the `passport.initialize()` method (run directly before) and passes
 *          it to the `passport.deserializeUser()` function (defined above in this module).  The `passport.deserializeUser()`
 *          function will look up the User by the given ID in the database and return it.
 *      2.  If the `passport.deserializeUser()` returns a user object, this user object is assigned to the `req.user` property
 *          and can be accessed within the route.  If no user is returned, nothing happens and `next()` is called.
 */
app.use(passport.initialize());
app.use(passport.session());

// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,

  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  "/graphql",
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 },
// });
//Npm run build will build your frontend app, and it will be optimized
app.use(express.static(path.join(__dirname, "frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});
await connectDB();
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀  Server ready at  port ${httpServer.address().port}`);
