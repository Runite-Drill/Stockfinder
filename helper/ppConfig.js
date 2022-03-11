const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");

//serialise user
//saving data to the session using a unique identified - id
passport.serializeUser(function(user,done){
    done(null,user.id);
})
//deserialise user
//Read information from the database according to user id (session)
passport.deserializeUser(function(id,done){
    User.findById(id, function(err,user){
        done(err,user)
    })
})

//check passwords
passport.use(new LocalStrategy(
    {
        usernameField: "username",
        passwordField: "password",
    },
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }//user not found
        if (!user.verifyPassword(password)) { return done(null, false); }//incorrect password
        return done(null, user);
      });
    }
));

module.exports = passport;