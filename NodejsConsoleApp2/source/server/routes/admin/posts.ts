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
        .exec((err, posts) => {
            if (err) { return next(err); }
            res.render("admin/posts/index", { posts: posts });
        });
});

router.get("/new", (req, res, next) => {
    res.render("admin/posts/new");
});

router.post("/", (req, res, next) => {
    let newPost = new Post(req.body);
    newPost.userId = res.locals.currentUser._id;
    savePost(newPost).subscribe(
        (post: any) => { res.redirect(`/admin/posts/${post._id}`); },
        (err) => { return next(err); }
    );
});

router.get("/:id", (req, res, next) => {
    getPost(req.params.id).subscribe(
        (post) => { res.render("admin/posts/show", { post: post }); },
        (err) => { return next(err); }
    );
});

router.get("/:id/edit", (req, res, next) => {
    getPost(req.params.id).subscribe(
        (post) => { res.render("admin/posts/edit", { post: post }); },
        (err) => { return next(err); }
    );
});

router.post("/:id/edit", (req, res, next) => {
    Rx.Observable.create((observer) => {
        Post.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, post) => {
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
    Post.findByIdAndRemove(req.params.id, (err, record) => {
        if (err) {
            return next(err);
        }
       res.redirect("/admin/posts");
    });
});

export = router;