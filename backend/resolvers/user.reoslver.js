import { users } from "../dummyData/data.js";
const userResolver = {
  Query: {
    users: () => {
      return users;
    },
    user: (parent, { userId }) => {
      return users.find((user) => user.id == userId);
    },
  },
  Mutation: {},
};
export default userResolver;
