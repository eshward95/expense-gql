import bcrypt from "bcryptjs";
import { GraphQLLocalStrategy } from "graphql-passport";
import passport from "passport";
import User from "../models/user.model.js";
export const configurePassport = async () => {
  // serializeUser() is setting id as cookie in user’s browser and
  // deserializeUser() is getting id from the cookie, which is then used in callback to get user info or something else,
  // based on that id or some other piece of information from the cookie…
  passport.serializeUser((user, done) => {
    console.log("Serializing user");
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    console.log("deserializing user");
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) throw new Error("Invalid username or password");
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new Error("Invalid username or password");
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
};
