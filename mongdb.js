const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-app";

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (err, client) => {
	if (err) {
		return console.log("error connecting to mongodb");
	}

	console.log("connected successfully");

	const db = client.db(databaseName);
});
