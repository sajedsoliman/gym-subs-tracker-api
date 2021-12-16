// member mutation resolvers
const member = require("./endpoints/member");

// subscription mutation resolvers
const subscription = require("./endpoints/subscription");

module.exports = {
	createMember: member.create,
	updateMember: member.update,
	createSubscription: subscription.create,
	paySubscription: subscription.pay,
	cancelSubscription: subscription.cancel,
};
