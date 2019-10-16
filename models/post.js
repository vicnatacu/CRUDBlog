const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Post schema
const Post = new Schema({
    title: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        required: true
    },
    modified_date: {
        type: Date,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: String,
    comments: [{
        username: String,
        comment: String
    }]
});

Post.statics.findByCategory = function (category) {
    return this.find({category: category});
}

Post.statics.findByUsername = function (username) {
	return this.find({username: username})
}

module.exports = mongoose.model("Post", Post)