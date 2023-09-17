const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const List = require("../models/listModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token: token,
    user: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password ", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password ", 401));
  }

  const token = signToken(user._id);

  let data = {
    status: "success",
    token,
    email,
  };

  res.status(200).json(data);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in ", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("the user belonging to the id no longer exists", 401)
    );
  }

  req.user = freshUser;

  next();
});

exports.checkBoardEditPermission = catchAsync(async (req, res, next) => {
  if (!req.body.board || !req.user.adminBoard.includes(req.body.board)) {
    return next(new AppError("Not authorized", 401));
  }

  next();
});

exports.checkBoardViewPermission = catchAsync(async (req, res, next) => {
  if (
    !(
      req.user.adminBoard.includes(req.params.id) ||
      req.user.userBoard.includes(req.params.id)
    )
  ) {
    return next(new AppError("Not authorized", 401));
  }

  next();
});

exports.checkListEditPermission = catchAsync(async (req, res, next) => {
  const list = await List.findById(req.body.list);
  if (!req.user.adminBoard.includes(list.board)) {
    return next(new AppError("Not authorized", 401));
  }

  next();
});
