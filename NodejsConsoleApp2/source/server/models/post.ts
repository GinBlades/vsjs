import mongoose = require("mongoose");
import ModelBase = require("./model_base");

class Post {
    public static mongooseModel = mongoose.model("Post", Post.postSchema());

    public static get(id: number) {
        return ModelBase.get(Post.mongooseModel, id);
    };

    public static save(post) {
        return ModelBase.save(post);
    };

    private static postSchema() {
        return mongoose.Schema({
            userId: mongoose.Schema.Types.ObjectId,
            title: String,
            body: String,
            publishedAt: { type: Date, default: Date.now },
            excerpt: String
        });
    }
}

export = Post;