// API's for article module

//Include model
// const User = require("../models/User"); 
// const Stock = require("../models/Stock");
// const moment = require("moment");

//HTTP GET - load an Add Article form
exports.search_home_get = (req, res) => {
    res.render("search/home");
}