const express = require("express");
const isLoggedIn = require('../helper/isLoggedIn');
const router = express.Router();

const searchCtrl = require("../controllers/stock");
router.get("/stock/:symbol", searchCtrl.stock_detail_get);

module.exports = router;