import express = require("express");
let router = express.Router();

router.get("/about", (_req, res) => {
    res.render("about");
});

router.get("/contact", (_req, res) => {
    res.render("contact");
});

router.get("/", (_req, res) => {
    res.render("index");
});

export = router;