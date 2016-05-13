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

router.get("/new", (req, res, next) => {
    res.render("users/new");
});

router.get("/:id", ensureAuthenticated, (req, res, next) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!User) {
            return next(404);
        }
        res.render("users/show", { user: user });
    });
});

router.get("/:id/edit", ensureAuthenticated, (req, res, next) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!User) {
            return next(404);
        }
        res.render("users/edit", { user: user });
    });
});

router.post("/:id/edit", ensureAuthenticated, (req, res, next) => {
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

router.get("/:id/delete", (req, res, next) => {
    res.redirect("/admin/users");
});

router.get("/", (req, res, next) => {
    User.find()
        .sort({ createdAt: "descending" })
        .exec((err, users) => {
            if (err) { return next(err); }
            res.render("users/index", { users: users });
        });
});

export = router;