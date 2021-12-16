const { UserInputError } = require("apollo-server-errors");
const { Kind } = require("graphql/language");
const { GraphQLScalarType } = require("graphql");

const DateType = new GraphQLScalarType({
	name: "DateType",
	description: "A Date() type in GraphQL as a scalar",
	serialize(value) {
		return value.toISOString();
	},
	parseLiteral(ast) {
		if (ast.kind === Kind.STRING) {
			const date = new Date(ast.value);
			return isNaN(date) ? undefined : date;
		}
	},
	parseValue(value) {
		const date = new Date(value);

		if (isNaN(date)) {
			throw new UserInputError("invalid date", {
				errors: {
					date: "Date is invalid",
				},
			});
		} else return date;
	},
});

module.exports = {
	DateType,
};
