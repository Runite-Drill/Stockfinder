//Middleweare for user logged in check
module.exports = (req,res,next) => {
    if (!req.user) { //is user logged in/active
        res.redirect("/signin");
    } else {
        next(); //next means: continue the code with no disruption - i.e. go to the next function
    }
}