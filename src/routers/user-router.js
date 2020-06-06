const express = require("express");
const User = require("../models/user");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");

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

//update user
UserRouter.patch("/users/me", auth, async (req, res) => {
	const allowedUpdate = ["name", "age", "password", "email"];

	const contentToUpdate = req.body;

	if (
		!Object.keys(contentToUpdate).every((key) => allowedUpdate.includes(key))
	) {
		return res.status(400).send("invalid update field");
	}

	try {
		Object.keys(contentToUpdate).forEach((field) => {
			req.user[field] = contentToUpdate[field];
		});

		await req.user.save();

		res.send(req.user);
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});

UserRouter.delete("/users/me", auth, async (req, res) => {
	try {
		await req.user.remove();
		res.send(req.user);
	} catch (e) {
		res.status(500).send();
	}
});

const upload = multer({
	limits: {
		fileSize: 50000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error("File type must be jpg/jpeg/png"));
		}
		cb(undefined, true);
	},
});

//upload avatar
UserRouter.post(
	"/users/avatar",
	auth,
	upload.single("avatar"),
	async (req, res) => {
		const buffer = await sharp(req.file.buffer)
			.resize(250, 250)
			.png()
			.toBuffer();
		req.user.avatar = buffer;
		await req.user.save();
		res.send();
	},
	(err, req, res, next) => {
		res.status(400).send({ error: err.message });
	}
);

//delete avatar
UserRouter.delete("/users/me/avatar", auth, async (req, res) => {
	if (!req.user.avatar) {
		return res.status(400).send("no avatar");
	}
	try {
		req.user.avatar = undefined;
		await req.user.save();

		res.send(req.user);
	} catch (e) {
		console.log(e);
		res.status(500).send();
	}
});

//get user avatar by user ID
UserRouter.get("/users/:id/avatar", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) {
			throw new Error("Cannot find user or user avatar");
		}
		res.set("Content-type", "image/png");
		res.send(user.avatar);
	} catch (e) {
		res.status(404).send(e);
	}
});

module.exports = UserRouter;
