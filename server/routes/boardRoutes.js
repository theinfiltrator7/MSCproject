const express = require("express");
const boardController = require("../controllers/boardController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(authController.protect, boardController.createBoard)
  .get(authController.protect, boardController.getAllBoards);

router
  .route("/:id")
  .get(
    [authController.protect, authController.checkBoardViewPermission],
    boardController.getBoardDetails
  );

module.exports = router;
