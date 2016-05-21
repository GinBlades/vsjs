import mongoose = require("mongoose");
import ModelBase = require("./model_base");

class Post {
    public static mongooseModel: MongooseModel<PostProperties> = mongoose.model("Post", Post.postSchema());

    public static get(id: string) {
        return ModelBase.get(Post.mongooseModel, id);
    };

    public static save(post) {
        return ModelBase.save(post);
    };

    public static update(id: string, post: any) {
        return ModelBase.update(Post.mongooseModel, id, post);
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