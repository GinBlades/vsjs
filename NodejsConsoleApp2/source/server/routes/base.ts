import express = require("express");

class RouterBase {
    protected router = express.Router();
    private pluralized: string;

    constructor(private model, private name: string) {
        this.pluralized = this.name + "s";
    }

    public allRoutes() {
        ["index", "show", "newRoute", "create", "edit", "update", "destroy"].forEach((route) => {
            this[route]();
        });
        return this.router;
    }

    public index() {
        this.router.get("/", (req, res, next) => {
            this.model.mongooseModel.find()
                .exec((err, records) => {
                    if (err) { return next(err); }
                    res.render(`admin/${this.pluralized}/index`, { records: records });
                });
        });
    }

    public show() {
        this.router.get("/:id", (req, res, next) => {
            this.model.get(req.params.id).subscribe(
                (record) => { res.render(`admin/${this.pluralized}/show`, { record: record }); },
                (err) => { return next(err); }
            );
        });
    }

    public newRoute() {
        this.router.get("/new", (req, res, next) => {
            res.render(`admin/${this.pluralized}/new`);
        });
    }

    public create() {
        this.router.post("/", (req, res, next) => {
            let newRecord = new this.model.mongooseModel(req.body);
            newRecord.userId = res.locals.currentUser._id;
            this.model.save(newRecord).subscribe(
                (record: any) => { res.redirect(`/admin/${this.pluralized}/${record._id}`); },
                (err) => { return next(err); }
            );
        });
    }

    public edit() {
        this.router.get("/:id/edit", (req, res, next) => {
            this.model.get(req.params.id).subscribe(
                (record) => { res.render(`admin/${this.pluralized}/edit`, { record: record }); },
                (err) => { return next(err); }
            );
        });
    }

    public update() {
        this.router.post("/:id/edit", (req, res, next) => {
            this.model.update(req.params.id, req.body).subscribe(
                (record: any) => { res.redirect(`/admin/${this.pluralized}/${record._id}`); },
                (err) => { return next(err); }
            );
        });
    }

    public destroy() {
        this.router.get("/:id/delete", (req, res, next) => {
            this.model.mongooseModel.findByIdAndRemove(req.params.id, (err, record) => {
                if (err) {
                    return next(err);
                }
            res.redirect(`/admin/${this.pluralized}`);
            });
        });
    }
}

export = RouterBase;