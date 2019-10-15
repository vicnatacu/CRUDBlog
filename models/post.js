const mongoose = require("mongoose")
const Schema = mongoose.Schema

//Database Schema File
//Databse Table

// Define Post schema
const Post = new Schema({
	title: {
		type: String,
		required: true,
		minlength: [6, "Please ensure title is more than 6 characters"],
		maxlength:[20]
		
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
		required: true,
		minlength: [6, "Please ensure user has 6 or more characters"],
		maxlength: [12]

	},
	content: {
		type: String,
		required: true,
		maxlength: [400, "Please limit your comments to 400 characters"]
	},
	category: String
})

module.exports = mongoose.model("Post", Post)