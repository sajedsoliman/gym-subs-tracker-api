// db
const { ObjectId } = require("mongodb");
const { getMemberCollection, getSubscriptionCollection } = require("../init");
const { addIdProperty } = require("../helpers");

async function byId(id) {
	const member = await getMemberCollection().findOne({ _id: ObjectId(id) });

	return addIdProperty(member);
}

async function byName(name) {
	const member = await getMemberCollection().findOne({
		name: { $regex: name },
	});

	return member ? addIdProperty(member) : null;
}

async function hasActiveSubscription(id) {
	return (
		(await getSubscriptionCollection().findOne({
			member: id,
			canceled: { $exists: false },
			$expr: { $gt: ["$expiringDate", new Date()] },
		})) !== null
	);
}

async function hasUnpaidSubscription(id) {
	return (
		(await getSubscriptionCollection().findOne({
			member: id,
			canceled: { $exists: false },
			isPaid: false,
		})) !== null
	);
}

async function isExisted(name) {
	const member = await getMemberCollection().findOne({ name });

	return member !== null;
}

module.exports = {
	byId,
	byName,
	hasActiveSubscription,
	hasUnpaidSubscription,
	isExisted,
};
