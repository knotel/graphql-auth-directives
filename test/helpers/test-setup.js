// TODO: will need to set appropriate env vars

const { ApolloServer } = require("apollo-server");
const { gql } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

const {
  IsAuthenticatedDirective,
  HasRoleDirective,
  HasScopeDirective
} = require("../src/index");

require("dotenv").config();

module.exports = gql`

directive @hasScope(scopes: [String]) on OBJECT | FIELD_DEFINITION
directive @hasRole(roles: [Role]) on OBJECT | FIELD_DEFINITION
directive @isAuthenticated on OBJECT | FIELD_DEFINITION

enum Role {
    reader
    user
    admin
}

type User {
    id: ID!
    name: String
}

type Item  {
    id: ID!
    name: String
}

type Query {
    userById(userId: ID!): User @hasScope(scopes: ["User:Read"])
    itemById(itemId: ID!): Item @hasScope(scopes: ["Item:Read"])
}

type Mutation {
    createUser(id: ID!, name: String): User @hasScope(scopes: ["User:Create"])
    createItem(id: ID!, name: String): Item @hasScope(scopes: ["Item:Create"])

    updateUser(id: ID!, name: String): User @hasScope(scopes: ["User:Update"])
    updateItem(id: ID!, name: String): Item @hasScope(scopes: ["Item:Update"])

    deleteUser(id: ID!): User @hasScope(scopes: ["User:Delete"])
    deleteItem(id: ID!): Item @hasScope(scopes: ["Item:Delete"])
    
    addUserItemRelationship(userId: ID!, itemId: ID!): User @hasScope(scopes: ["User:Create", "Item:Create"])
}
`;

const resolvers = {
  Query: {
    userById(object, params, ctx, resolveInfo) {
      console.log("userById resolver");
      return {
        id: params.userId,
        name: "bob"
      };
    },
    itemById(object, params, ctx, resolveInfo) {
      console.log("itemById resolver");
      return {
        id: "123",
        name: "bob"
      };
    }
  },
  Mutation: {
    createUser(object, params, ctx, resolveInfo) {
      // createUser mutation should never be called
      throw new Error("createUser resolver called");
    },
    createItem(object, params, ctx, resolveInfo) {
      console.log("createItem resolver");
    },
    updateUser(object, params, ctx, resolveInfo) {
      console.log("updateUser resolver");
    },
    updateItem(object, params, ctx, resolveInfo) {
      console.log("updateItem resolver");
    },
    deleteUser(object, params, ctx, resolveInfo) {
      console.log("deleteUser resolver");
    },
    deleteItem(object, params, ctx, resolveInfo) {
      console.log("deleteItem resolver");
    },
    addUserItemRelationship(object, params, ctx, resolveInfo) {
      console.log("addUserItemRelationship resolver");
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    isAuthenticated: IsAuthenticatedDirective,
    hasRole: HasRoleDirective,
    hasScope: HasScopeDirective
  }
});

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    return req;
  }
});

server.listen(3000, "0.0.0.0").then(({ url }) => {
  console.log(`GraphQL server ready at ${url}`);
});
