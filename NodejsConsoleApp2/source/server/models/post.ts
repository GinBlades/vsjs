import mongoose = require("mongoose");
declare var ObjectId: any;

let postSchema = mongoose.Schema({
    user: ObjectId,
    title: String,
    body: String,
    publishedAt: { type: Date, default: Date.now },
    excerpt: String
});

export = mongoose.model("Post", postSchema);