//API's for User Model
//Include model
const User = require("../models/User");
const moment = require("moment");

// HTTP GET - user profile - to load the signup form
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