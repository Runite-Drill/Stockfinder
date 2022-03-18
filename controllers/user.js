//API's for User Model
//Include model
const User = require("../models/User");
const Stock = require("../models/Stock");
const moment = require("moment");

// HTTP GET - user profile - to load the user's profile
exports.user_profile_get = (req,res) => {
    User.findOne({username: req.params.username}).populate('stocksFollowed')
    .then((user) => {
        if (req.user && req.user.username === user.username) {
            res.render("user/ownProfile", {user, moment});
        } else {
            res.render("user/profile", {user, moment});
        }
    })
    .catch((err)=>{console.log(err); res.send("Error displaying user profile.")})
}

// HTTP GET - Edit user profile
exports.user_edit_get = (req,res) => {
    User.findOne({username: req.params.username}).populate('stocksFollowed')
    .then((user)=> {
        if (req.user && req.user.username === user.username) {
            res.render("user/editProfile", {user, moment});
        } else {
            res.redirect(`/stockfinder/profile/${req.params.username}`);
        }
    })
    .catch((err)=>{console.log(err); res.send("Error displaying edit profile form.")})
}

// HTTP POST - Edit user profile
exports.user_edit_post = (req,res) => {

    if (req.body.clearSearchHistory) {
        req.body.searchHistory = [];
    }

    User.findOneAndUpdate({username: req.params.username}, req.body).populate('stocksFollowed')
    .then((user)=> {
        user.stocksFollowed.forEach(stockId=>{
            Stock.findById(stockId).populate('followers')
            .then()
            .catch((err)=>{console.log(err); res.send("Error updating link to stock.")})
        })
        res.redirect(`/stockfinder/profile/${req.body.username}`);
    })
    .catch((err)=>{console.log(err); res.send("Error updating accound.")})
}

// HTTP GET - delete user profile
exports.user_delete_get = (req,res) => {
    User.findOneAndDelete({username: req.params.username})
    .then(()=> {
        res.redirect("/stockfinder/signup");
    })
    .catch((err)=>{console.log(err); res.send("Error deleting user account.")})
}