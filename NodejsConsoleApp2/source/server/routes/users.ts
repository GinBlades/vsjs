import express = require("express");
import User = require("../models/user");
let router = express.Router();

let ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("info", "You must be logged in to see this page.");
        res.redirect("/sessions/login");
    }
};

// Set local variables for use in all routes
router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

router.get("/:username", (req, res, next) => {
    User.findOne({ username: req.params.username }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!User) {
            return next(404);
        }
        res.render("users/profile", { user: user });
    });
});

router.get("/edit", ensureAuthenticated, (req, res) => {
    res.render("users/edit");
});

router.post("/edit", ensureAuthenticated, (req, res, next) => {
    req.user.displayName = req.body.displayName;
    req.user.bio = req.body.bio;
    req.user.save((err) => {
        if (err) {
            next(err);
            return;
        }
        req.flash("info", "Profile updated!");
        res.redirect("/edit");
    });
});

router.get("/", (req, res, next) => {
    User.find()
        .sort({ createdAt: "descending" })
        .exec((err, users) => {
            if (err) { return next(err); }
            res.render("index", { users: users });
        });
});

export = router;