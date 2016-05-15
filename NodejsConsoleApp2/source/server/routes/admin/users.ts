import express = require("express");
import Rx = require("rx");
import User = require("../../models/user");
let router = express.Router();

let ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("info", "You must be logged in to see this page.");
        res.redirect("/sessions/login");
    }
};

let getUser = (id: number) => {
    return Rx.Observable.create((observer) => {
        User.findOne({ _id: id }, (err, user) => {
            console.log(user);
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
}

// Set local variables for use in all routes
router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

router.get("/new", ensureAuthenticated, (req, res, next) => {
    res.render("admin/users/new");
});

router.post("/", ensureAuthenticated, (req, res, next) => {
    let newUser = new User(req.body);
    saveUser(newUser).subscribe(
        (user: any) => { res.redirect(`/admin/users/${user._id}`); },
        (err) => { return next(err) }
    );
})

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
        User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
            if (err) {
                observer.onError(err);
                return;
            }
            observer.onNext(user);
            observer.onCompleted;
        });
    }).subscribe(
        (user: any) => { res.redirect(`/admin/users/${user._id}`); },
        (err) => { return next(err); }
    );
});

router.get("/:id/delete", (req, res, next) => {
    User.findByIdAndRemove(req.params.id, (err, record) => {
        if (err) {
            return next(err);
        }
       res.redirect("/admin/users");
    });
});

router.get("/", (req, res, next) => {
    User.find()
        .sort({ createdAt: "descending" })
        .exec((err, users) => {
            if (err) { return next(err); }
            res.render("admin/users/index", { users: users });
        });
});

export = router;