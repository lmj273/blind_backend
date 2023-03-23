var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var boardRouter = require("./routes/board");
const thumbRouter = require("./routes/thumb");
const categoryRouter = require("./routes/category");
const searchRouter = require("./routes/search");
var commentRouter = require("./routes/comment");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/board", boardRouter);
app.use("/thumb", thumbRouter);
app.use("/category", categoryRouter);
app.use("/search", searchRouter);
app.use("/comment", commentRouter);

module.exports = app;
