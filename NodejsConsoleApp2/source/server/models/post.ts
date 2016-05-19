import mongoose = require("mongoose");
import Rx = require("rx");

class Post {
    private static postSchema = () => {
        return mongoose.Schema({
            userId: mongoose.Schema.Types.ObjectId,
            title: String,
            body: String,
            publishedAt: { type: Date, default: Date.now },
            excerpt: String
        });
    }

    public static mongooseModel = mongoose.model("Post", Post.postSchema());

    public static getPost(id: number) {
        return Rx.Observable.create((observer) => {
            Post.mongooseModel().findOne({ _id: id }, (err, post) => {
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

    public static savePost(post) {
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
}

export = Post;