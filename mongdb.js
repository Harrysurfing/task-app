const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-app";

MongoClient.connect(
	connectionURL,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err, client) => {
		if (err) {
			return console.log("error connecting to mongodb");
		}

		console.log("connected successfully");

		const db = client.db(databaseName);

		// db.collection("tasks").insertMany(
		// 	[
		// 		{
		// 			description: "task1",
		// 			completed: false,
		// 		},
		// 		{
		// 			description: "task2",
		// 			completed: false,
		// 		},
		// 		{
		// 			description: "task3",
		// 			completed: true,
		// 		},
		// 	],
		// 	(err, res) => {
		// 		if (err) {
		// 			return console.log(err);
		// 		}
		// 		console.log(res.ops);
		// 	}
		// );

		// db.collection("tasks").findOne({ description: "task1" }, (err, result) => {
		// 	if (err) {
		// 		return console.log(err);
		// 	}

		// 	console.log(result);
		// });

		// db.collection("tasks")
		// 	.find({ completed: false })
		// 	.toArray((err, res) => {
		// 		console.log(res);
		// 	});

		// db.collection("tasks")
		// 	.updateMany({ completed: false }, { $set: { completed: true } })
		// 	.then((res) => {
		// 		console.log(res.result);
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});

		db.collection("tasks")
			.deleteMany({ description: "task1" })
			.then((res) => {
				console.log(res.result);
			})
			.catch((err) => console.log(err));
	}
);
