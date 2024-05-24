import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, args, context) => {
      try {
        if (!context.getUser()) throw new error("Unauthorized");
        const userId = context.getUser()._id;
        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (error) {
        console.log("error getting transaction", error);
        throw new error(error.message);
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.log("error getting transaction", error);
        throw new Error(error.message);
      }
    },
    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");
      const userId = context.getUser()._id;
      const transactions = await Transaction.find({ userId });

      const categoryMap = transactions.reduce((acc, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = 0;
        }
        acc[curr.category] += curr.amount;
        return acc;
      }, {});
      return Object.entries(categoryMap).map(([category, total]) => ({
        category,
        total,
      }));
    },
  },
  Mutation: {
    createTransaction: async (parent, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.log("error creating transaction", error);
        throw new Error(error.message);
      }
    },
    updateTransaction: async (_, { input }, context) => {
      try {
        const updateTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        return updateTransaction;
      } catch (error) {
        console.log("error updating transaction", error);
        throw new Error(error.message);
      }
    },
    deleteTransaction: async (parent, { transactionId }, context) => {
      try {
        const deleteTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        return deleteTransaction;
      } catch (error) {
        console.log("error deleting transaction", error);
        throw new Error(error.message);
      }
    },
  },
  Transaction: {
    user: async (parent) => {
      const userId = parent.userId;
      try {
        const user = await User.findById(userId);
        return user;
      } catch (error) {
        console.log("Error getting user");
        throw new Error(error.message);
      }
    },
  },
};
export default transactionResolver;
