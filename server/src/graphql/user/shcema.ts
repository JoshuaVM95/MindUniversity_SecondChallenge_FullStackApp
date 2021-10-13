export const UsersSchema = `
    extend type Query {
        user(userId: String!): User!
        users(filterByEmail: String!, page: Int!, rowsPerPage: Int): UserList!
    }

    extend type Mutation {
        login(email: String!, password: String!): String!
        createUser(email: String!, password: String!, firstName: String!, lastName: String!, isAdmin: Boolean): ResponseMessage!
        deleteUsers(userIds: [String!]!): ResponseMessage!
        updateUser(userId: String!, email: String, password: String, firstName: String, lastName: String, isAdmin: Boolean): ResponseMessage!
    }

    type User {
        id: ID!
        email: String!
        userInfo: UserInfo
        isSuper: Boolean!
        createdAt: String!
        latestPositions: [UserAccount]
    }

    type UserInfo {
        firstName: String!
        lastName: String!
        createdBy: User!
        updatedBy: User
        updatedAt: String
        isAdmin: Boolean!
        englishLevel: String
        technicalSkills: String
        cvLink: String
    }

    type UserList {
        users: [User!]!
        totalUsers: Int!
    }
`;
