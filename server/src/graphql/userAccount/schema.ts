export const UsersAccountsSchema = `
    extend type Query {
        userAccount(userAccountId: String!): UserAccount!
        usersAccounts(filterBy: Filter, page: Int!, rowsPerPage: Int!): UserAccountList!
    }

    extend type Mutation {
        addUserAccount(accountId: String!, userId: String!, position: String!): ResponseMessage!
        updateUserAccount(userAccountId: String!, position: String, endDate: String): ResponseMessage!
    }

    type UserAccount {
        id: ID!
        user: User!
        account: Account!
        initDate: String!
        endDate: String
        addedBy: User!
        removedBy: User
        position: String!
    }

    type UserAccountList {
        usersAccounts: [UserAccount!]!
        totalUsersAccounts: Int!
    }

    input Filter {
        account: String
        name: String
        initDate: String
        endDate: String
    }
`;
