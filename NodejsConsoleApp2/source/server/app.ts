/// <reference path="../../typings/main.d.ts" />
import path = require("path");
import express = require("express");
import morgan = require("morgan");
import helmet = require("helmet");

let app = express();

app.use(morgan("short"));
app.use(helmet());

let staticPath = path.join(__dirname, "../client");
app.use(express.static(staticPath));

app.get("/", (req, res) => {
    res.end("Welcome!");
});

app.listen(3000, () => {
    console.log("App started on port 3000");
});