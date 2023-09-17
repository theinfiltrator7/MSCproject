const express = require("express");
const listController = require("../controllers/listController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(
    [authController.protect, authController.checkBoardEditPermission],
    listController.createList
  );

module.exports = router;
