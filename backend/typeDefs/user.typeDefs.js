const userTypeDefs = `#graphql
type User {
    id:ID!,
    username:String!,
    name:String!,
    password:String!,
    profilePic:String,
    gender:String!
}
type Query {
    users:[User!],
    # No required because null if not authenticated
    authUser:User,
    user(userId:ID!):User
}
type Mutation {
    signup(input:SignUpInput!):User
    login(userId:LoginInput!):User
    logout:LogoutResponse
}
# input types are specifically designed to be used as arguments in mutations 
# and therefore only define fields that can be accepted as inputs
input SignUpInput {
    userName:String!
    name:String!
    password:String!
    gender:String!
}
input LoginInput {
    username:String!
    password:String!
}
type LogoutResponse {
    message:String
}
`;

export default userTypeDefs;
