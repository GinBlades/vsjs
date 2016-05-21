import RouterBase = require("../base");
import Post = require("../../models/post");

class AdminPostsRouter extends RouterBase {
    constructor() {
        super(Post, "post");
    }

    public index() {
        this.router.get("/", (req, res, next) => {
            Post.mongooseModel.find()
                .sort({ createdAt: "descending" })
                .exec((err, posts) => {
                    if (err) { return next(err); }
                    res.render("admin/posts/index", { posts: posts });
                });
        });
    }
}

export = AdminPostsRouter;