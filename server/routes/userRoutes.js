const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router
  .route("/add-board-user")
  .post(
    [authController.protect, authController.checkBoardEditPermission],
    userController.addUserToBoard
  );

router
  .route("/add-board-admin")
  .post(
    [authController.protect, authController.checkBoardEditPermission],
    userController.addAdminToBoard
  );

router
  .route("/remove-board-user")
  .post(
    [authController.protect, authController.checkBoardEditPermission],
    userController.removeUserFromBoard
  );

router
  .route("/remove-board-admin")
  .post(
    [authController.protect, authController.checkBoardEditPermission],
    userController.removeAdminFromBoard
  );

router
  .route("/add-skills-user")
  .post([authController.protect], userController.addSkillsToUser);

module.exports = router;
