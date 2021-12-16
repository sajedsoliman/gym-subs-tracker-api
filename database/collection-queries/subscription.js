// db
const { ObjectId } = require("mongodb");
const { addIdProperty, getDateFromDateObject } = require("../helpers");
const { getSubscriptionCollection } = require("../init");
const memberDB = require("./member");

async function byId(id) {
	const subscription = await getSubscriptionCollection().findOne({
		_id: ObjectId(id),
	});

	return {
		...addIdProperty(subscription),
		member: await memberDB.byId(subscription.member),
		startingDate: getDateFromDateObject(subscription.startingDate),
	};
}

async function isEnded(id) {
	return (
		(await getSubscriptionCollection().findOne({ _id: ObjectId(id) })
			.expiringDate) < new Date()
	);
}

module.exports = {
	byId,
	isEnded,
};
