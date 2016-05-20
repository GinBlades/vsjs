import express = require("express");
import Rx = require("rx");
import Post = require("../../models/post");

let router = express.Router();

router.get("/", (req, res, next) => {
    Post.mongooseModel.find()
        .sort({ createdAt: "descending" })
        .exec((err, posts) => {
            if (err) { return next(err); }
            res.render("admin/posts/index", { posts: posts });
        });
});

router.get("/new", (req, res, next) => {
    res.render("admin/posts/new");
});

router.post("/", (req, res, next) => {
    let newPost = new Post.mongooseModel(req.body);
    newPost.userId = res.locals.currentUser._id;
    Post.save(newPost).subscribe(
        (post: any) => { res.redirect(`/admin/posts/${post._id}`); },
        (err) => { return next(err); }
    );
});

router.get("/:id", (req, res, next) => {
    Post.get(req.params.id).subscribe(
        (post) => { res.render("admin/posts/show", { post: post }); },
        (err) => { return next(err); }
    );
});

router.get("/:id/edit", (req, res, next) => {
    Post.get(req.params.id).subscribe(
        (post) => { res.render("admin/posts/edit", { post: post }); },
        (err) => { return next(err); }
    );
});

router.post("/:id/edit", (req, res, next) => {
    Rx.Observable.create((observer) => {
        Post.mongooseModel.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, post) => {
            if (err) {
                observer.onError(err);
                return;
            }
            observer.onNext(post);
            observer.onCompleted();
        });
    }).subscribe(
        (post: any) => { res.redirect(`/admin/posts/${post._id}`); },
        (err) => { return next(err); }
    );
});

router.get("/:id/delete", (req, res, next) => {
    Post.mongooseModel.findByIdAndRemove(req.params.id, (err, record) => {
        if (err) {
            return next(err);
        }
       res.redirect("/admin/posts");
    });
});

export = router;