const { UserInputError } = require("apollo-server-express");

exports.throwInputError = (message) => {
	throw new UserInputError(message);
};
