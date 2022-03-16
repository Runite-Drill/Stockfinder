const express = require("express");
const isLoggedIn = require('../helper/isLoggedIn');
const router = express.Router();

const stockCtrl = require("../controllers/stock");
router.get("/stock/:symbol", stockCtrl.stock_detail_get);
router.get("/follow", stockCtrl.stock_follow_get);

module.exports = router;