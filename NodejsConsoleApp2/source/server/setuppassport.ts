import passport = require("passport");
import localStrategy = require("passport-local");
import User = require("./models/user");

passport.use("login", new localStrategy.Strategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: "No user has that username!" });
        }
        user.checkPassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Invalid password." });
            }
        });
    });
}));

export = () => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};