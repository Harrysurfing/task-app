const express = require("express");
const Tasks = require("../models/tasks");
const mongoose = require("mongoose");

const TaskRouter = new express.Router();

TaskRouter.get("/tasks", async (req, res) => {
	try {
		const tasks = await Tasks.find({});
		res.send(tasks);
	} catch (e) {
		res.status(500).send(e);
	}
});
TaskRouter.get("/tasks/:id", async (req, res) => {
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
TaskRouter.patch("/tasks/:id", async (req, res) => {
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
		const updatedTask = await Tasks.findByIdAndUpdate(id, contentToUpdate, {
			new: true,
			runValidators: true,
		});

		if (!updatedTask) {
			return res.status(404).send("no task found");
		}
		res.send(updatedTask);
	} catch (e) {
		res.status(500).send();
	}
});
TaskRouter.post("/tasks", async (req, res) => {
	const task = new Tasks(req.body);

	try {
		await task.save();
		res.status(201).send(task);
	} catch (e) {
		res.status(400).send(e);
	}
});
TaskRouter.delete("/tasks/:id", async (req, res) => {
	const id = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send("invalide id");
	}

	try {
		const task = await Tasks.findByIdAndDelete(id);
		if (!task) {
			return res.status(404).send("no task found");
		}
		res.send(task);
	} catch (e) {
		res.status(500).send();
	}
});

module.exports = TaskRouter;
