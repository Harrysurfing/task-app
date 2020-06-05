const express = require("express");
const Tasks = require("../models/tasks");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");

const TaskRouter = new express.Router();

TaskRouter.get("/tasks", auth, async (req, res) => {
	try {
		const tasks = await Tasks.find({ owner: req.user._id });
		res.send(tasks);
	} catch (e) {
		res.status(500).send(e);
	}
});
TaskRouter.get("/tasks/:id", auth, async (req, res) => {
	const id = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send("not a valid id");
	}

	try {
		// const task = await Tasks.findById(id);
		const task = await Tasks.findOne({ _id: id, owner: req.user._id });
		if (!task) {
			return res.status(404).send("no task found");
		}
		res.send(task);
	} catch (e) {
		res.status(500).send();
	}
});
TaskRouter.patch("/tasks/:id", auth, async (req, res) => {
	const id = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send("invalid id");
	}
	const contentToUpdate = req.body;
	const allowedUpdate = ["name", "description", "completed"];
	if (
		!Object.keys(contentToUpdate).every((field) =>
			allowedUpdate.includes(field)
		)
	) {
		return res.status(400).send("invalid update field");
	}
	try {
		const task = await Tasks.findOne({ _id: id, owner: req.user._id });
		if (!task) {
			return res.status(404).send("task not found");
		}
		Object.keys(contentToUpdate).forEach((key) => {
			task[key] = contentToUpdate[key];
		});

		await task.save();

		res.send(task);
	} catch (e) {
		res.status(500).send();
	}
});

TaskRouter.post("/tasks", auth, async (req, res) => {
	// const task = new Tasks(req.body);
	const task = new Tasks({
		...req.body,
		owner: req.user._id,
	});

	try {
		await task.save();
		res.status(201).send(task);
	} catch (e) {
		res.status(400).send(e);
	}
});

TaskRouter.delete("/tasks/:id", auth, async (req, res) => {
	const id = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send("invalide id");
	}

	try {
		const task = await Tasks.findOneAndDelete({ _id: id, owner: req.user._id });
		if (!task) {
			return res.status(404).send("no task found");
		}

		res.send(task);
	} catch (e) {
		res.status(500).send();
	}
});

module.exports = TaskRouter;
