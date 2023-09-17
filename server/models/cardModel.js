const mongoose = require("mongoose");

const checkListSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  hoursRequired: {
    type: Number,
    default: 0,
  },
});

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
      default: undefined,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    checkList: [checkListSchema],
    assignedTo: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    rank: Number,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const card = mongoose.model("Card", cardSchema);

module.exports = card;
