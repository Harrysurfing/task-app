const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user-router");
const taskRouter = require("./routers/task-router");

const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
// 	res.status(503).send("sever under maintainence");
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log("Sever is up on port " + port);
});
