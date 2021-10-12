import { UsersSchema } from "./user/shcema";
import { AccountsSchema } from "./account/schema";
import { UsersAccountsSchema } from "./userAccount/schema";

const typeDefs = `
  type Query {
    example: String!
  }

  type Mutation {
    example: String!
  }

  type ResponseMessage {
      message: String!
      code: Int!
  }
`;

const schemaDefs = [typeDefs, UsersSchema, AccountsSchema, UsersAccountsSchema];

export default schemaDefs;
