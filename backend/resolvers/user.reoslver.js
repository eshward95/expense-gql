import bcrypt from "bcryptjs";
import { users } from "../dummyData/data.js";
import User from "../models/user.model.js";
const userResolver = {
  Query: {
    users: () => {
      return users;
    },
    user: (parent, { userId }) => {
      return users.find((user) => user.id == userId);
    },
    authUser: async (_, __, context) => {
      try {
        // if (!req.isAuthenticated()) {
        //   return null;
        // }
        const user = await context.getUser();
        return user;
      } catch (error) {
        console.log("Error in authUser", err);
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    signup: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;
        const existingUser = await User.findOne({ username });
        if (existingUser) throw new Error(`User ${username} already exists`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let genderType = gender === "male" ? "boy" : "girl";
        console.log(genderType);
        let profilePicture = `https://avatar.iran.liara.run/public/${genderType}?username=${username}`;
        const newUser = new User({
          username,
          password: hashedPassword,
          gender,
          name,
          profilePicture: profilePicture,
        });
        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (error) {
        console.log("Error in signup", error);
        throw new Error(error.message);
      }
    },
    login: async (_, { input }, context) => {
      // console.log(args);
      try {
        const { username, password } = input;
        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });
        console.log(user);
        await context.login(user);
        return user;
      } catch (error) {
        console.log("Error in login", error);
        throw new Error(error.message);
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout();
        context.req.session.destroy((err) => {
          if (err) throw new Error(err);
        });
        context.res.clearCookie("connect.sid");
        return { message: "Logged out" };
      } catch (error) {
        console.log("Error in logout", err);
        throw new Error(error.message);
      }
    },
  },
};
export default userResolver;
