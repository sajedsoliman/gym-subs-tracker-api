// member query resolvers
const member = require("./endpoints/member");

// subscription query resolvers
const subscription = require("./endpoints/subscription");

module.exports = {
	members: member.list,
	subscriptions: subscription.list,
};
