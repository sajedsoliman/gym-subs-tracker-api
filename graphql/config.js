const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const fs = require("fs");

// resolvers
const queryResolvers = require("./resolvers/query");
const mutationResolvers = require("./resolvers/mutation");
const { DateType } = require("./scalarTypes");
const resolvers = {
	Query: queryResolvers,
	Mutation: mutationResolvers,

	// scalar types
	DateType,
};
// typeDefs
const schemaFile = fs.readFileSync("./graphql/schema.graphql", "utf-8");
const schema = makeExecutableSchema({
	typeDefs: schemaFile,
	resolvers,
});

// creating a server instance
const QlServer = new ApolloServer({
	schema: schema,
});

// initiative function
async function initQlServer(app) {
	await QlServer.start();

	QlServer.applyMiddleware({
		app,
		path: "/graphql",
		cors: {
			methods: "POST",
			credentials: true,
			origin: process.env.CLIENT_ORIGIN,
		},
	});
}

module.exports = { initQlServer };
