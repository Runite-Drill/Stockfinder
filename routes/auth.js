const express = require("express");
const router = express.Router();

const authCtrl = require("../controllers/auth");
router.get("/auth/signup", authCtrl.auth_signup_get);

module.exports = router;