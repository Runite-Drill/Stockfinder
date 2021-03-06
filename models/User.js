const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        minLength: [1, "Username must be more than 1 character."],
        maxLength: [16, "Username must be less than 16 characters."]
    },
    emailAddress: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "Your password must be at least 6 characters."],
    },
    searchHistory: {
        type: Array,
        default: [],
    },
    stocksFollowed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

},
    {timestamps: true}
)

//verify password
userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;