/// <reference path="../../typings/main.d.ts" />
/// <reference path="./interfaces.ts" />
import path = require("path");
import express = require("express");
import morgan = require("morgan");
import helmet = require("helmet");
import mongoose = require("mongoose");
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import session = require("express-session");
import flash = require("connect-flash");
import passport = require("passport");
import setupPassport = require("./setuppassport");

import routes = require("./routes/main");
import sessions = require("./routes/sessions");
import users = require("./routes/admin/users");
import admin = require("./routes/admin");
import adminPosts = require("./routes/admin/posts");

let app = express();

mongoose.connect("mongodb://localhost:27017/test");
setupPassport();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(morgan("short"));
app.use(helmet());

let staticPath = path.join(__dirname, "../client");
app.use(express.static(staticPath));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    resave: true,
    secret: "sbtvey7HPkSjuC6EyMu9Kw",
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use("/sessions", sessions);
app.use("/", routes);

app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("info", "You must be logged in to see this page.");
        res.redirect("/sessions/login");
    }
});

// Set local variables for use in all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

app.use("/admin", admin);
app.use("/admin/users", users);
app.use("/admin/posts", new adminPosts().allRoutes());

app.listen(app.get("port"), () => {
    console.log("Server started on port " + app.get("port"));
});