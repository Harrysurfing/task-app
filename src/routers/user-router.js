const express = require("express");
const User = require("../models/user");
const mongoose = require("mongoose");

const UserRouter = new express.Router();

UserRouter.post("/users", async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		res.status(201).send(user);
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});
UserRouter.get("/users", async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (e) {
		res.status(500).send(e);
	}
});

UserRouter.get("/users/:id", async (req, res) => {
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

UserRouter.patch("/users/:id", async (req, res) => {
	const allowedUpdate = ["name", "age", "password", "email"];
	const id = req.params.id;
	const contentToUpdate = req.body;

	if (
		!Object.keys(contentToUpdate).every((key) => allowedUpdate.includes(key))
	) {
		return res.status(400).send("invalid update field");
	}
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send("invalide id");
	}

	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).send("user not found");
		}

		Object.keys(contentToUpdate).forEach((field) => {
			user[field] = contentToUpdate[field];
		});

		await user.save();

		res.send(user);

		// const updatedUser = await User.findByIdAndUpdate(id, contentToUpdate, {
		// 	new: true,
		// 	runValidators: true,
		// });
		// if (!updatedUser) {
		// 	return res.status(404).send();
		// }
		// res.send(updatedUser);
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});

UserRouter.delete("/users/:id", async (req, res) => {
	const id = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send("invalide id");
	}

	try {
		const user = await User.findByIdAndDelete(id);
		if (!user) {
			return res.status(404).send("no user found");
		}
		res.send(user);
	} catch (e) {
		res.status(500).send();
	}
});

module.exports = UserRouter;
