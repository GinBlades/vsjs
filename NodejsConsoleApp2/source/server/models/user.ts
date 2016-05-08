import mongoose = require("mongoose");
import bcrypt = require("bcrypt-nodejs");
const SALT_FACTOR = 10;

let userSchema = mongoose.Schema({
    bio: String,
    createdAt: { type: Date, default: Date.now },
    displayName: String,
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true }
});

userSchema.methods.name = function() {
    return this.displayName || this.username;
};

let noop = () => { return undefined; };

// a pre-save function
userSchema.pre("save", function (done) {
    let user = this;
    if (!user.isModified("password")) {
        return done();
    }

    // Generate a salt
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) { return done(err); }

        bcrypt.hash(user.password, salt, noop, (err, hashedPassword) => {
            if (err) { return done(err); }
            user.password = hashedPassword;
            done();
        });
    });
});

// Check hashed password
userSchema.methods.checkPassword = function (guess, done) {
    // Use `compare` instead of `===` to prevent a *timing attack*
    bcrypt.compare(guess, this.password, (err, isMatch) => {
        done(err, isMatch);
    });
};

let User = mongoose.model("User", userSchema);
module.exports = User;