const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-app-api", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

// const User = mongoose.model("User", {
// 	name: {
// 		type: String,
// 	},
// 	age: {
// 		type: Number,
// 	},
// });

// const me = new User({ name: "harry", age: "12" });

// me.save()
// 	.then((res) => {
// 		console.log(res);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});
const Schema = mongoose.Schema;
const Animal = new Schema({
	name: {
		type: String,
		default: "unkown",
	},
	age: {
		type: Number,
		min: 0,
	},
	illness: {
		type: Boolean,
		default: false,
	},
});

const Cat = mongoose.model("Cat", Animal);

const roti = new Cat({ name: "roti", age: 2 });

roti
	.save()
	.then((res) => {
		console.log(res);
	})
	.catch((err) => {
		console.log(err);
	});
