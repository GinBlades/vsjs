/// <reference path="../../typings/main.d.ts" />
import express = require("express");
import morgan = require("morgan");
let app = express();

app.use(morgan("short"));

app.get("/", (req, res) => {
    res.end("Welcome!");
});