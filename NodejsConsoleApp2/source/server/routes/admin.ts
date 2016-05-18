import express = require("express");
let router = express.Router();

// Set local variables for use in all routes
router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

router.get("/", (_req, res) => {
    res.render("admin/index");
});

export = router;