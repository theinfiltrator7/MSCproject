const Board = require("../models/boardModel");
const User = require("../models/userModel");
const List = require("../models/listModel");
const Card = require("../models/cardModel");

const catchAsync = require("../utils/catchAsync");

exports.createBoard = catchAsync(async (req, res, next) => {
  let newBoard = await Board.create({
    ...req.body,
    admins: [req.user._id],
  });

  let user = await User.findById(req.user._id);
  user.adminBoard.push(newBoard._id);
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    board: newBoard,
    user: user,
    status: "success",
  });
});

exports.getAllBoards = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.user._id)
    .populate({
      path: "adminBoard",
      model: "Board",
    })
    .populate({
      path: "userBoard",
      model: "Board",
    });
  res.status(200).json({ user });
});

exports.getBoardDetails = catchAsync(async (req, res, next) => {
  let board = await Board.findById(req.params.id)
    .populate({
      path: "admins",
      model: "User",
    })
    .populate({
      path: "users",
      model: "User",
    });
  let lists = await List.find({ board: board._id }).sort({ rank: 1 });
  let cards = await Card.find({ board: board._id }).populate({
    path: "assignedTo",
    model: "User",
  });
  res.status(200).json({ board, lists, cards });
});
