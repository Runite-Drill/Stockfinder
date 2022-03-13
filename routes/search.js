const express = require("express");
const isLoggedIn = require('../helper/isLoggedIn');
const router = express.Router();

const searchCtrl = require("../controllers/search");
router.get("/home", searchCtrl.search_home_get);
router.get("/search", searchCtrl.search_results_get);

module.exports = router;