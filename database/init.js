const { MongoClient } = require("mongodb");

let db;
async function connectDB() {
	const client = new MongoClient(process.env.DB_URL);

	try {
		await client.connect();
		db = client.db();
		console.log("DB connected");
	} catch (err) {
		console.log(err.message);
	}
}

function getMemberCollection() {
	return db.collection("members");
}
function getSubscriptionCollection() {
	return db.collection("subscriptions");
}

module.exports = {
	connectDB,
	getMemberCollection,
	getSubscriptionCollection,
};
