const express = require("express");
const isLoggedIn = require('../helper/isLoggedIn');
const router = express.Router();

const userCtrl = require("../controllers/user");
router.get("/profile/:username", userCtrl.user_profile_get);

module.exports = router;