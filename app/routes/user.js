const { auth } = require("../middlewares");
const controller = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();

router.get("/all", [auth.verifyToken], controller.allAccess);
router.post("/avatar", [auth.verifyToken], controller.updateAvatar);
router.post("/profile", [auth.verifyToken], controller.updateProfile);
router.get("/user", [auth.verifyToken], controller.allAccess);
router.get(
  "/cutie",
  [auth.verifyToken, auth.isCutie],
  controller.moderatorBoard
);

router.get(
  "/gifter",
  [auth.verifyToken, auth.isGifter],
  controller.adminBoard
);

module.exports = router;
