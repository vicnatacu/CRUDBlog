
const Post = require("../models/post")



// get all posts
// return a query
const getAllPosts = function (req) {
    // If we're passed a category in the query, filter on that category
    if (req.query.category) return Post.findByCategory(req.query.category);
    else if (req.query.username) return Post.findByUsername(req.query.username);
    else return Post.find();
};

// const getAllPosts = function(req) {
// 	return blogPosts
// }

// get post by id
// returns a query
const getPostById = function(req) {
	return Post.findById(req.params.id)
}

const getComments = async function (req) {
    let post = await Post.findById(req.params.postId)
    return post.comments
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

const deleteComment = async function (req) {
    return await Post.findOneAndUpdate({
        "comments._id": req.params.id
    }, {
        $pull: {
            comments: {
                _id: req.params.id
            }
        }
    }, {
        new: true
    });
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

// Add a comment to a post
// returns a promise (because it is async)
const addComment = async function (req) {
    let post = await Post.findById(req.params.postId);

    let newComment = {
        username: req.body.username,
        comment: req.body.comment
    };
    post.comments.push(newComment);
    return Post.findByIdAndUpdate(req.params.postId, post, {
        new: true
    });
}

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
    updatePost,
    addComment,
    getComments,
    deleteComment,
}
