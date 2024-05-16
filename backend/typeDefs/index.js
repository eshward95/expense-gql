import { mergeTypeDefs } from "@graphql-tools/merge";
import transactionTypeDef from "./transaction.typeDefs.js";
import userTypeDefs from "./user.typeDefs.js";

const mergedTypeDefs = mergeTypeDefs([userTypeDefs, transactionTypeDef]);
export default mergedTypeDefs;
