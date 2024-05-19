import Transaction from "../models/transaction.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, args, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const userId = context.getUser()._id;
        const transactions = await Transaction.find({ userId });
        console.log(transactions);
        return transactions;
      } catch (error) {
        console.log("Error getting transaction", err);
        throw new Error(error.message);
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.log("Error getting transaction", err);
        throw new Error(error.message);
      }
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
        console.log("Error creating transaction", err);
        throw new Error("Error creating transaction");
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
        console.log("Error updating transaction", err);
        throw new Error("Error updating transaction");
      }
    },
    deleteTransaction: async (parent, { transactionId }, context) => {
      try {
        const deleteTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        return deleteTransaction;
      } catch (error) {
        console.log("Error deleting transaction", err);
        throw new Error("Error deleting transaction");
      }
    },
  },
};
export default transactionResolver;
