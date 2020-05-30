const mongoose = require("mongoose");
const validator = require("validator");

const Tasks = mongoose.model("tasks", {
	name: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
	},
	completed: {
		type: Boolean,
		default: false,
	},
});

module.exports = Tasks;
