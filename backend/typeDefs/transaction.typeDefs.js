const transactionTypeDef = `#graphql
type Transaction {
    _id:ID!,
    userId:ID!,
    description:String!,
    paymentType:String!,
    category:String!,
    amount:Float!,
    location:String!
    data:String!
}
type Query {
    transactions:[Transaction!],
    transaction(transactionId:ID!):Transaction
}
type Mutation {
    createTransaction(input:CreateTransactionInput!):Transaction!
    updateTransaction(input:UpdateTransactionInput!):Transaction!
    deleteTransaction(transactionId:ID!):Transaction!
}
input CreateTransactionInput {
    description:String!
    payementType:String!
    category:String!
    amount:Float!
    date:String!
    location:String
}
input UpdateTransactionInput {
    transactionID:ID!
    description:String!
    payementType:String!
    category:String!
    amount:Float!
    date:String!
    location:String
}
`;
export default transactionTypeDef;
