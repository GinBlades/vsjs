import express = require("express");
import passport = require("passport");
import User = require("../models/user");
let router = express.Router();

// Set local variables for use in all routes
router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

router.get("/login", (req, res) => {
    res.render("sessions/login");
});

router.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/signup", (req, res) => {
    res.render("sessions/signup");
});

router.post("/signup", (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({ username: username }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (user) {
            req.flash("error", "User already exists");
            return res.redirect("/signup");
        }

        let newUser = new User({
            username: username,
            password: password
        });
        newUser.save(next);
    });
}, passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
}));

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

export = router;