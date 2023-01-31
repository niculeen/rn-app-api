const express = require("express");
const router = express.Router();
const user = require("./user");
const auth = require("./auth");

/* GET home page. */
router.use("/user", user);
router.use("/auth", auth);
router.get("/", (req, res)=>res.send("API is WORKING..."))
module.exports = router;
