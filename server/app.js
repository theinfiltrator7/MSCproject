const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const userRouter = require("./routes/userRoutes");
const boardRoutes = require("./routes/boardRoutes");
const listRoutes = require("./routes/listRoutes");
const cardRoutes = require("./routes/cardRoutes");
const globalErrorHandler = require("./controllers/errorController");

const AppError = require("./utils/appError");

const staticOptions = {
  setHeaders: function (res, path, stat) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
  },
};

app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "2MB" }));
app.use(express.urlencoded({ extended: true, limit: "2MB" }));
app.use(express.static("public", staticOptions));

app.use("/user", userRouter);
app.use("/board", boardRoutes);
app.use("/list", listRoutes);
app.use("/card", cardRoutes);

app.get("/hello", (req, res) => res.status(200).json({ Hello: "world" }));
app.post("/hello", (req, res) => res.status(200).json({ Hello: "world" }));

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
