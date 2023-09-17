const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const Board = require("../models/boardModel");
const Card = require("../models/cardModel");

exports.addUserToBoard = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.userBoard.includes(req.body.board)) {
    return res.status(409).json({ message: "User already member of board" });
  }

  const board = await Board.findById(req.body.board);
  board.users.push(user._id);
  await board.save();

  user.userBoard.push(req.body.board);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ message: "User added to board" });
});

exports.addAdminToBoard = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  if (user.adminBoard.includes(req.body.board)) {
    res.status(409).json({ message: "User already admin of board" });
  }

  const board = await Board.findById(req.body.board);
  board.admins.push(user._id);
  await board.save();

  user.adminBoard.push(req.body.board);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ message: "User added to board" });
});

exports.removeUserFromBoard = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  const board = await Board.findById(req.body.board);
  board.users.pull(user._id);
  await board.save();

  user.userBoard.pull(req.body.board);
  await user.save({ validateBeforeSave: false });

  const cards = await Card.find({ board: req.body.board });
  for (let card of cards) {
    card.assignedTo.pull(user._id);
    await card.save();
  }

  res.status(200).json({ message: "User removed from board" });
});

exports.removeAdminFromBoard = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  const board = await Board.findById(req.body.board);
  board.admins.pull(user._id);
  await board.save();

  user.adminBoard.pull(req.body.board);
  await user.save({ validateBeforeSave: false });

  const cards = await Card.find({ board: req.body.board });
  for (let card of cards) {
    card.assignedTo.pull(user._id);
    await card.save();
  }

  res.status(200).json({ message: "User removed from board" });
});

exports.addSkillsToUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  if (req.body.totalExperience) {
    user.totalExperience = req.body.totalExperience;
  }

  if (req.body.skills) {
    req.body.skills.forEach((skill) => {
      if (!user.skills.includes(skill)) {
        user.skills.push(skill);
      }
    });
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({ message: "Skills added to user", user });
});
