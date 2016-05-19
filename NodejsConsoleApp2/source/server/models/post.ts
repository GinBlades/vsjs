import mongoose = require("mongoose");
declare var Objectid: any;

let postSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    title: String,
    body: String,
    publishedAt: { type: Date, default: Date.now },
    excerpt: String
});

export = mongoose.model("Post", postSchema);