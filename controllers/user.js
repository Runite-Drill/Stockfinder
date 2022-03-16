//API's for User Model
//Include model
const User = require("../models/User");

// HTTP GET - user profile - to load the signup form
exports.user_profile_get = (req,res) => {
    User.findById(req.query.id)
    .then((user) => {
        if (req.user && req.user.id === user.id) {
            res.render("user/ownProfile", {user});
        } else {
            res.render("user/profile", {user});
        }
    })
    .catch((err)=>{console.log(err); res.send("Error displaying user profile.")})
}