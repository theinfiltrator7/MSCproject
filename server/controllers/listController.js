const List = require("../models/listModel");
const Board = require("../models/boardModel");
const User = require("../models/userModel");

const catchAsync = require("../utils/catchAsync");

exports.createList = catchAsync(async (req, res, next) => {
  let list = await List.create({
    ...req.body,
  });

  res.status(200).json({
    list: list,
    status: "success",
  });
});
