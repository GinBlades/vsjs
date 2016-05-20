import express = require("express");
import Rx = require("rx");
import User = require("../../models/user");
let router = express.Router();

router.get("/new", (req, res, next) => {
    res.render("admin/users/new");
});

router.post("/", (req, res, next) => {
    let newUser = new User.mongooseModel(req.body);
    User.save(newUser).subscribe(
        (user: any) => { res.redirect(`/admin/users/${user._id}`); },
        (err) => { return next(err); }
    );
});

router.get("/:id", (req, res, next) => {
    User.get(req.params.id).subscribe(
        (user) => { res.render("admin/users/show", { user: user }); },
        (err) => { return next(err); }
    );
});

router.get("/:id/edit", (req, res, next) => {
    User.get(req.params.id).subscribe(
        (user) => { res.render("admin/users/edit", { user: user }); },
        (err) => { return next(err); }
    );
});

router.post("/:id/edit", (req, res, next) => {
    Rx.Observable.create((observer) => {
        User.mongooseModel.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
            if (err) {
                observer.onError(err);
                return;
            }
            observer.onNext(user);
            observer.onCompleted();
        });
    }).subscribe(
        (user: any) => { res.redirect(`/admin/users/${user._id}`); },
        (err) => { return next(err); }
    );
});

router.get("/:id/delete", (req, res, next) => {
    User.mongooseModel.findByIdAndRemove(req.params.id, (err, record) => {
        if (err) {
            return next(err);
        }
       res.redirect("/admin/users");
    });
});

router.get("/", (req, res, next) => {
    User.mongooseModel.find()
        .sort({ createdAt: "descending" })
        .exec((err, users) => {
            if (err) { return next(err); }
            res.render("admin/users/index", { users: users });
        });
});

export = router;