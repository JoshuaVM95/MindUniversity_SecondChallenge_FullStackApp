import { UsersSchema } from "./user/shcema";
import { AccountsSchema } from "./account/schema";

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

const schemaDefs = [typeDefs, UsersSchema, AccountsSchema];

export default schemaDefs;
