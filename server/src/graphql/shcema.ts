import { UsersSchema } from "./user/shcema";
import { AccountsSchema } from "./account/schema";
import { UsersAccountsSchema } from "./userAccount/schema";
import { schemaV2 } from "./v2/schemaV2";

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

const schemaDefs = [typeDefs, UsersSchema, AccountsSchema, UsersAccountsSchema, ...schemaV2];

export default schemaDefs;
