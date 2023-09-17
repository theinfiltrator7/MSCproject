const Card = require("../models/cardModel");
const User = require("../models/userModel");

const catchAsync = require("../utils/catchAsync");

exports.createCard = catchAsync(async (req, res, next) => {
  let newCard = await Card.create({
    ...req.body,
  });
  res.status(200).json({
    card: newCard,
    status: "success",
  });
});

exports.getAllCards = catchAsync(async (req, res, next) => {
  let cards = await Card.find({ board: req.params.id });
  res.status(200).json({ cards });
});

exports.patchCard = catchAsync(async (req, res, next) => {
  let card = await Card.findOneAndUpdate({ _id: req.body._id }, req.body, {
    new: true,
  });
  res.status(200).json({ card });
});

exports.deleteCard = catchAsync(async (req, res, next) => {
  let card = await Card.findOneAndDelete({ _id: req.params.id });
  res.status(200).json({ card });
});

exports.addUserToCard = catchAsync(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  const card = await Card.findById(req.body.cardId);

  if (card.assignedTo.includes(user._id)) {
    return res.status(409).json({ message: "User already assigned to card" });
  }

  card.assignedTo.push(user._id);

  await card.save();

  const newCard = await Card.findById(req.body.cardId).populate({
    path: "assignedTo",
    model: "User",
  });

  res.status(200).json({ newCard });
});

exports.removeUserFromCard = catchAsync(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  const card = await Card.findById(req.body.cardId);

  card.assignedTo.pull(user._id);

  await card.save();

  const newCard = await Card.findById(req.body.cardId).populate({
    path: "assignedTo",
    model: "User",
  });

  res.status(200).json({ newCard });
});
