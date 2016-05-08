/// <reference path="../../typings/main.d.ts" />
import path = require("path");
import express = require("express");
import morgan = require("morgan");
import helmet = require("helmet");
import mongoose = require("mongoose");
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import session = require("express-session");
import flash = require("connect-flash");
import routes = require("./routes/main");

let app = express();

mongoose.connect("mongodb://localhost:27017/test");

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
    secret: "secretkey",
    saveUninitialized: true
}));
app.use(flash());

app.use("/", routes);

app.listen(app.get("port"), () => {
    console.log("Server started on port " + app.get("port"));
});