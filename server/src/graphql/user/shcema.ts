export const UsersSchema = `
    extend type Query {
        user(userId: String!): User!
        users: [User!]!
    }

    extend type Mutation {
        login(email: String!, password: String!): LoginResponse!
        createUser(email: String!, password: String!, firstName: String!, lastName: String!, isAdmin: Boolean): ResponseMessage!
    }

    type User {
        id: ID!
        email: String!
        userInfo: UserInfo
        isSuper: Boolean!
        createdAt: String!
    }

    type UserInfo {
        firstName: String!
        lastName: String!
        createdBy: User!
        isAdmin: Boolean!
    }

    type LoginResponse {
        token: String!
        role: Int!
    }
`;
