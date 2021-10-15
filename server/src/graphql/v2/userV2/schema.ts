export const UsersSchemaV2 = `
    extend type Query {
        userV2(userId: String!): UserV2!
        usersV2(filterByEmail: String!, page: Int!, rowsPerPage: Int): UserListV2!
    }

    extend type Mutation {
        loginV2(email: String!, password: String!): String!
        createUserV2(email: String!, password: String!, firstName: String!, lastName: String!, isAdmin: Boolean): ResponseMessage!
        deleteUsersV2(userIds: [String!]!): ResponseMessage!
        updateUserV2(userId: String!, email: String, password: String, firstName: String, lastName: String, isAdmin: Boolean): ResponseMessage!
        updateUserInfoV2(englishLevel: String, technicalSkills: String, cvLink: String): ResponseMessage!
    }

    type UserV2 {
        id: ID!
        email: String!
        userInfo: UserInfoV2
        isSuper: Boolean!
        createdAt: String!
        latestPositions: [UserAccount]
    }

    type UserInfoV2 {
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

    type UserListV2 {
        users: [UserV2!]!
        totalUsers: Int!
    }
`;
