const express = require("express");
const User = require("../models/user");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");

const UserRouter = new express.Router();

//create user
UserRouter.post("/users", async (req, res) => {
	const user = new User(req.body);

	try {
		const token = await user.generateAuthToken();
		await user.save();
		res.status(201).send({ user, token });
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});

//user login
UserRouter.post("/users/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findByCredentials(email, password);
		const token = await user.generateAuthToken();

		res.send({ user, token });
	} catch (e) {
		res.status(400).send();
	}
});

//get all users
UserRouter.get("/users", auth, async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (e) {
		res.status(500).send(e);
	}
});

//get logged in user
UserRouter.get("/users/me", auth, async (req, res) => {
	res.send(req.user);
});

//log out user
UserRouter.post("/users/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((el) => {
			return el.token !== req.token;
		});

		await req.user.save();
		res.send("logged out!");
	} catch (e) {
		res.status(500).send();
	}
});

//log out all devieces
UserRouter.post("/users/logoutall", auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send("All devieces are logged out!");
	} catch (e) {
		console.log(e);
		res.status(500).send();
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
		return res.status(400).send("invalid id");
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
