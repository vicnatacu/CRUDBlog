
const Post = require("../models/post")



// get all posts
// return a query
const getAllPosts = function(req) {
	return Post.find()
}

// const getAllPosts = function(req) {
// 	return blogPosts
// }

// get post by id
// returns a query
const getPostById = function(req) {
	return Post.findById(req.params.id)
}


// add post
// returns a new Post object
const addPost = function (req) {
    let date = Date.now();
    // Set dates for this new post
    req.body.create_date = date;
    req.body.modified_date = date;
    return new Post(req.body);
};

// delete post
// returns a query
const deletePost = function(id) {
	return Post.findByIdAndRemove(id)
}

// update post
// returns a query
const updatePost = function (req) {
    req.body.modified_date = Date.now();
    // use new:true to return the updated post rather than the original post when the query is executed
    return Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
};

function filter(queryParams) {
    let filteredPosts = [];
    if (queryParams.category && queryParams.category.length > 0 || 
        queryParams.username && queryParams.username.length > 0) {
        for (let post in blogPosts) {
            if (blogPosts[post].category === queryParams.category ||
                blogPost[post].username === queryParams.username){
                console.log(blogPosts[post].title)
            // Object.assign(filteredPosts, blogPosts[post]);
            filteredPosts.push(blogPosts[post])
        }
        }
        
    } else filteredPosts = blogPosts;

    return filteredPosts;

}

module.exports = {
    getAllPosts,
    getPostById,
    addPost,
    deletePost,
    updatePost
}
