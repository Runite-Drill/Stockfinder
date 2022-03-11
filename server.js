//Initialise Express App
const express = require("express");
const mongoose = require("mongoose");
// const flash = require("connect-flash");
//configure ENV into process.env
require("dotenv").config();

const PORT = process.env.PORT;
const app = express();

//look for static files here (CSS, JS, Images, Video, Audio)
app.use(express.static("public"));

//Look in the views folder for a file name "layout.ejs"
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);

//initialise session/cookies
// let session = require('express-session');
// let passport = require('./helper/ppConfig');

// app.use(session({
//     secret: process.env.secret,
//     saveUninitialized: true,
//     resave: false, //don't resave if cookie is modified
//     cookie: {maxAge: 360000}, //milliseconds until cookie timeout
// }))
// //must go before routes
// app.use(passport.initialize());
// app.use(passport.session());

// app.use(flash());

//Share session information with all pages
// app.use(function(req,res,next) {
//     res.locals.currentUser = req.user;
//     res.locals.alerts = req.flash();
//     next(); //next is from the express framework
// })


//Import Routes
const searchRoute = require("./routes/search");
const stockRoute = require("./routes/stock");
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
//Mount routes
app.use("/stockfinder/", searchRoute);
// app.use("/stockfinder/", stockRoute);
// app.use("/stockfinder/", authRoute);
// app.use("/stockfinder/", profileRoute);

//NodeJS to look in a folder called views for ejs files
app.set("view engine", "ejs"); //i.e. no need for "../view/.."

//Connect to Mongodb
mongoose.connect(process.env.mongoDBurl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    ()=>console.log("mongodb connected successfully!")
);

app.listen(PORT, () => console.log(`App is running on port ${PORT}.`));