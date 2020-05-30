const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Tasks = require("./models/tasks");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", (req, res) => {
	const user = new User(req.body);

	user
		.save()
		.then(() => {
			res.status(201).send(user);
		})
		.catch((e) => {
			res.status(400).send(e);
		});
});
app.get("/users", (req, res) => {
	User.find({})
		.then((users) => {
			res.send(users);
		})
		.catch((e) => res.status(500).send());
});

app.get("/users/:id", (req, res) => {
	const id = req.params.id;
	console.log(id);
	User.findById(id)
		.then((user) => {
			if (!user) {
				return res.status(404).send("no user found");
			}
			res.status(200).send(user);
		})
		.catch((e) => {
			res.status(500).send(e);
		});
});

app.get("/tasks", (req, res) => {
	Tasks.find({})
		.then((tasks) => {
			res.send(tasks);
		})
		.catch((e) => res.status(400).send(e));
});

app.get("/tasks/:id", (req, res) => {
	const id = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send("not a valid id");
	}
	Tasks.findById(id)
		.then((task) => {
			if (!task) {
				return res.status(404).send("no task found");
			}
			res.send(task);
		})
		.catch((e) => res.status(500).send(e));
});

app.post("/tasks", (req, res) => {
	const task = new Tasks(req.body);

	task
		.save()
		.then(() => {
			res.status(201).send(task);
		})
		.catch((e) => {
			res.status(400).send(e);
		});
});

app.listen(port, () => {
	console.log("Sever is up on port " + port);
});
