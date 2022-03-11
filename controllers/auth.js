//API's for User Authentication
//Include model
const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcrypt");
const salt = 10;
const {validationResult} = require('express-validator');

// HTTP GET - Signup - to load the signup form
exports.auth_signup_get = (req,res)=> {
    res.render("auth/signup");
}

// HTTP POST - Signup - Post the signup data
exports.auth_signup_post = (req,res)=> {
    let user = new User(req.body);

    // Encrypt the password using bcrypt & salt
    let hash = bcrypt.hashSync(req.body.password, salt);
    user.password = hash;

    user.save()
    .then(()=>{res.redirect("signin")})
    .catch((err)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("validationErrors", errors.errors);
            res.redirect('signup');
        }
        console.log(err);  
        // res.send("Error creating user: " + err._message+'.')

    })
}

// HTTP GET - SignIn - to load the signin form
exports.auth_signin_get = (req,res)=> {
    res.render("auth/signin");
}

// HTTP POST - SignIn - to post the sign-in data
exports.auth_signin_post = passport.authenticate("local", {
    successRedirect: "search", 
    failureRedirect: "signin",
    successFlash: "Logged in successfully.",
    failureFlash: "Invalid login or password.",
})

// HTTP GET - logout - to logout the user
exports.auth_logout_get = (req,res) => {
    // This will clear the session
    req.logout();
    req.flash("success", "Logout success!");
    res.redirect("signin");
}