const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    admins: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

const board = mongoose.model("Board", boardSchema);

module.exports = board;
