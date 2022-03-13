// API's for article module

//Include model
// const User = require("../models/User"); 
// const Stock = require("../models/Stock");
// const moment = require("moment");
// const Search = require("../helper/search");

//HTTP GET - load homepage
exports.search_home_get = (req, res) => {
    res.render("search/home");
}
//HTTP GET - load search results
exports.search_results_get = (req, res) => {
    //parse search string and get results
    let sStr = req.query.searchStr;

    res.render("search/results", {searchStr: req.query.searchStr});
}