const express = require("express");
const cardController = require("../controllers/cardController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(
    [authController.protect, authController.checkListEditPermission],
    cardController.createCard
  )
  .get(cardController.getAllCards)
  .patch(
    [authController.protect, authController.checkListEditPermission],
    cardController.patchCard
  );

router
  .route("/:id")
  .delete(
    [authController.protect, authController.checkListEditPermission],
    cardController.deleteCard
  );

router
  .route("/addUser")
  .patch(
    [authController.protect, authController.checkListEditPermission],
    cardController.addUserToCard
  );

router
  .route("/removeUser")
  .patch(
    [authController.protect, authController.checkListEditPermission],
    cardController.removeUserFromCard
  );

module.exports = router;
