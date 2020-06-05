const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = mongoose.Schema({
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
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
});

// taskSchema.pre('save')

const Tasks = mongoose.model("tasks", taskSchema);

module.exports = Tasks;
