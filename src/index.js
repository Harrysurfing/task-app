const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Tasks = require("./models/tasks");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		res.status(201).send(user);
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});
app.get("/users", async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (e) {
		res.status(500).send(e);
	}
});

app.get("/users/:id", async (req, res) => {
	const id = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		res.status(400).send("not valid id");
	}

	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).send("no user found");
		}
		res.send(user);
	} catch (e) {
		console.log(e);
		res.status(500).send(e);
	}
});

app.get("/tasks", async (req, res) => {
	try {
		const tasks = await Tasks.find({});
		res.send(tasks);
	} catch (e) {
		res.status(500).send(e);
	}
});

app.get("/tasks/:id", async (req, res) => {
	const id = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send("not a valid id");
	}

	try {
		const task = await Tasks.findById(id);
		if (!task) {
			return res.status(404).send("no task found");
		}
		res.send(task);
	} catch (e) {
		res.status(500).send();
	}
});

app.post("/tasks", async (req, res) => {
	const task = new Tasks(req.body);

	try {
		await task.save();
		res.status(201).send(task);
	} catch (e) {
		res.status(400).send(e);
	}
});

app.listen(port, () => {
	console.log("Sever is up on port " + port);
});
