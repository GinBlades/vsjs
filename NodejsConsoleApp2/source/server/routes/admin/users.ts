﻿import express = require("express");
import Rx = require("rx");
import * as userModel from "../../models/user";
let router = express.Router();

let getUser = (id: number) => {
    return Rx.Observable.create((observer) => {
        userModel.User.findOne({ _id: id }, (err, user) => {
            if (err) {
                observer.onError(err);
            }
            if (!user) {
                observer.onError(404);
            } else {
                observer.onNext(user);
                observer.onCompleted();
            }
        });
    });
};

let saveUser = (user) => {
    return Rx.Observable.create((observer) => {
        user.save((err, user) => {
            if (err) {
                observer.onError(err);
                return;
            }
            observer.onNext(user);
            observer.onCompleted();
        });
    });
};

router.get("/new", (req, res, next) => {
    res.render("admin/users/new");
});

router.post("/", (req, res, next) => {
    let newUser = new userModel.User(req.body);
    saveUser(newUser).subscribe(
        (user: any) => { res.redirect(`/admin/users/${user._id}`); },
        (err) => { return next(err); }
    );
});

router.get("/:id", (req, res, next) => {
    getUser(req.params.id).subscribe(
        (user) => { res.render("admin/users/show", { user: user }); },
        (err) => { return next(err); }
    );
});

router.get("/:id/edit", (req, res, next) => {
    getUser(req.params.id).subscribe(
        (user) => { res.render("admin/users/edit", { user: user }); },
        (err) => { return next(err); }
    );
});

router.post("/:id/edit", (req, res, next) => {
    Rx.Observable.create((observer) => {
        userModel.User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
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
    userModel.User.findByIdAndRemove(req.params.id, (err, record) => {
        if (err) {
            return next(err);
        }
       res.redirect("/admin/users");
    });
});

router.get("/", (req, res, next) => {
    userModel.User.find()
        .sort({ createdAt: "descending" })
        .exec((err, users) => {
            if (err) { return next(err); }
            res.render("admin/users/index", { users: users });
        });
});

export = router;