﻿import express = require("express");
import User = require("../models/user");
let router = express.Router();

// Set local variables for use in all routes
router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

router.get("/", (req, res, next) => {
    User.find()
        .sort({ createdAt: "descending" })
        .exec((err, users) => {
            if (err) { return next(err); }
            res.render("index", { users: users });
     });
});

module.exports = router;