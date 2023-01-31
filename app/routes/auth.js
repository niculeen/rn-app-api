const passport = require("passport")
const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();

router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  controller.signup
);
router.post("/signin", passport.authenticate('local'/* , { failureRedirect: '/login' } */), controller.signin);
router.post("/verify", controller.verify);
router.post("/otp", controller.otp);

module.exports = router;
