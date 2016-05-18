import express = require("express");
import Rx = require("rx");
import Post = require("../../models/post");

let router = express.Router();

let getPost = (id: number) => {
    return Rx.Observable.create((observer) => {
        Post.findOne({ _id: id }, (err, post) => {
            if (err) {
                observer.onError(err);
            }
            if (!post) {
                observer.onError(404);
            } else {
                observer.onNext(post);
                observer.onCompleted();
            }
        });
    });
};

let savePost = (post) => {
    return Rx.Observable.create((observer) => {
        post.save((err, record) => {
            if (err) {
                observer.onError(err);
                return;
            }
            observer.onNext(record);
            observer.onCompleted();
        });
    });
};

router.get("/", (req, res, next) => {
    Post.find()
        .sort({ createdAt: "descending" })
        .exec((err, users) => {
            if (err) { return next(err); }
            res.render("admin/users/index", { users: users });
        });
});

router.get("/new", (req, res, next) => {
    res.render("admin/users/new");
});

router.post("/", (req, res, next) => {
    let newPost = new Post(req.body);
    savePost(newPost).subscribe(
        (user: any) => { res.redirect(`/admin/users/${user._id}`); },
        (err) => { return next(err); }
    );
});

router.get("/:id", (req, res, next) => {
    getPost(req.params.id).subscribe(
        (user) => { res.render("admin/users/show", { user: user }); },
        (err) => { return next(err); }
    );
});

router.get("/:id/edit", (req, res, next) => {
    getPost(req.params.id).subscribe(
        (user) => { res.render("admin/users/edit", { user: user }); },
        (err) => { return next(err); }
    );
});

router.post("/:id/edit", (req, res, next) => {
    Rx.Observable.create((observer) => {
        Post.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
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
    Post.findByIdAndRemove(req.params.id, (err, record) => {
        if (err) {
            return next(err);
        }
       res.redirect("/admin/users");
    });
});

export = router;