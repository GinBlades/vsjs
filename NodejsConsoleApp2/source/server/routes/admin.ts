import express = require("express");
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

router.get("/", ensureAuthenticated, (_req, res) => {
    res.render("admin/index");
});

export = router;