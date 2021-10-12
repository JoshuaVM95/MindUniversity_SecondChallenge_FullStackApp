export const AccountsSchema = `
    extend type Query {
        account(accountId: String!): Account!
        accounts(filterByName: String!, page: Int!, rowsPerPage: Int!): AccountList!
    }

    extend type Mutation {
        createAccount(name: String!, client: String!, lead: String!): ResponseMessage!
        deleteAccounts(accountIds: [String!]!): ResponseMessage!
        updateAccount(accountId: String!, name: String, client: String, lead: String): ResponseMessage!
    }

    type Account {
        id: ID!
        name: String!
        client: String!
        lead: User!
        createdAt: String!
        createdBy: User!
    }

    type AccountList {
        accounts: [Account!]!
        totalAccounts: Int!
    }
`;
