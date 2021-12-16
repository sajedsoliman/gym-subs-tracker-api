// db
const { ObjectId } = require("mongodb");
const { getMemberCollection } = require("../../../database/init");
const memberDB = require("../../../database/collection-queries/member");

// helpers
const { addIdProperty } = require("../../../database/helpers");
const { throwInputError } = require("../../helpers");

async function list(_, { name }) {
	const filters = {};
	if (name) filters.name = { $regex: name };
	const membersCursor = await getMemberCollection()
		.find(filters)
		.sort({ enrollmentDate: -1 });
	const members = await membersCursor.toArray();

	return members.map((member) => addIdProperty(member));
}

async function create(_, { member }) {
	if (await memberDB.isExisted(member.name))
		throwInputError("الاعب موجود فعلا في النادي");

	// add the enrollment date
	member.enrollmentDate = new Date();
	const result = await getMemberCollection().insertOne(member);
	const savedMember = await getMemberCollection().findOne({
		_id: result.insertedId,
	});

	return addIdProperty(savedMember);
}

async function update(_, { member: memberNewValues, id }) {
	if (await memberDB.isExisted(memberNewValues.name))
		throwInputError("الاعب موجود فعلا في النادي");

	await getMemberCollection().updateOne(
		{ _id: ObjectId(id) },
		{ $set: memberNewValues }
	);
	const savedMember = await getMemberCollection().findOne({
		_id: ObjectId(id),
	});

	return addIdProperty(savedMember);
}

module.exports = { list, create, update };
