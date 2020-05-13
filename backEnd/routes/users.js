const express = require("express");
const router = express.Router();
const userControlller = require("../controllers/user")

router.post("/signup",userControlller.createUser)

router.post("/login", userControlller.loginUser)
module.exports = router;