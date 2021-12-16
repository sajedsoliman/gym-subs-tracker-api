// db
const { ObjectId } = require("mongodb");
const { getSubscriptionCollection } = require("../../../database/init");
const subscriptionDB = require("../../../database/collection-queries/subscription");
const memberDB = require("../../../database/collection-queries/member");

// helpers
const {
	addIdProperty,
	getDateFromDateObject,
} = require("../../../database/helpers");
const { throwInputError } = require("../../helpers");

async function list(_, { memberName, paidStatus, day, month, year }) {
	const filters = {};

	if (memberName) {
		const member = await memberDB.byName(memberName);
		if (!member) throwInputError("لا يوجد لاعب بهذا الاسم");
		filters.member = member.id.toString();
	}
	if (day != undefined) filters["startingDate.day"] = day;
	if (month != undefined) filters["startingDate.month"] = month;
	if (year != undefined) filters["startingDate.year"] = year;
	if (paidStatus != undefined) filters.isPaid = paidStatus;

	const subscriptionsCursor = await getSubscriptionCollection()
		.find({
			...filters,
			canceled: { $exists: false },
		})
		.sort({
			"startingDate.day": -1,
			"startingDate.month": -1,
			"startingDate.year": -1,
		});

	const subscriptions = await subscriptionsCursor.toArray();

	return subscriptions.map(async (sub) => {
		return {
			...addIdProperty(sub),
			member: await memberDB.byId(sub.member),
			startingDate: getDateFromDateObject(sub.startingDate),
		};
	});
}

async function create(_, { subscription }) {
	if (await memberDB.hasActiveSubscription(subscription.member))
		throwInputError("الاعب مشترك بالفعل");
	if (await memberDB.hasUnpaidSubscription(subscription.member))
		throwInputError("يوجد اشتراك غير مدفوع حتى الان");

	// add the start date object (month, day, year) props
	const currentDate = new Date();
	subscription.startingDate = {
		day: currentDate.getDate(),
		month: currentDate.getMonth(),
		year: currentDate.getFullYear(),
	};

	const result = await getSubscriptionCollection().insertOne(subscription);
	const savedSubscription = await subscriptionDB.byId(result.insertedId);

	return savedSubscription;
}

async function cancel(_, { id }) {
	if (await subscriptionDB.isEnded(id)) throwInputError("الاشتراك منتهي");

	const result = await getSubscriptionCollection().updateOne(
		{ _id: ObjectId(id) },
		{ $set: { canceled: new Date() } }
	);

	return await subscriptionDB.byId(id);
}

async function pay(_, { id }) {
	await getSubscriptionCollection().updateOne(
		{ _id: ObjectId(id) },
		{ $set: { isPaid: true } }
	);
	const subscription = await subscriptionDB.byId(id);

	return subscription;
}

module.exports = { list, create, pay, cancel };
