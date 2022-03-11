//API's for User Authentication
//Include model
// const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcrypt");
const salt = 10;
const {validationResult} = require('express-validator');

// HTTP GET - SignUp - to load the signup form
exports.auth_signup_get = (req,res)=> {
    res.render("auth/signup");
}