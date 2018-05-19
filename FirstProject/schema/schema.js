const axios = require('axios');
const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`).then(response => response.data );
      }
    },
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({ // use of closures
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(response => response.data );
      }
    },
  })
});

// Root Query -> Allows us to jump in our graph of data
// Find me a User with ID 23 -> Root query is the entry point in to our data
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      // Give me the id as an argument, and I will return a User
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/users/${args.id}`).then(response => response.data );
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`).then(response => response.data );
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const { firstName, age } = args;
        return axios.post('http://localhost:3000/users', {
          firstName,
          age,
        }).then(response => response.data );
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        const { id } = args;
        return axios.delete(`http://localhost:3000/users/${id}`).then(response => response.data );
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        // PUT request does a complete replacement of the existent record:
        /*
        record: {
          id: 1,
          firstName: 'Daniel',
          age: 20,
          companyId: 1
        }
        PUT: { firstName: 'Pedro' }
        OUTPUT: {
          id: null,
          firstName: 'Pedro',
          age: null,
          companyId: null
        }
        If you want to update only some specific properties, use the PATCH request
        */
        const { id } = args;
        return axios.patch(`http://localhost:3000/users/${id}`, args).then(response => response.data );
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
