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

const schemaDefs = [typeDefs];

export default schemaDefs;
