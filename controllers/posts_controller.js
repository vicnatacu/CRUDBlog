const {
    getAllPosts,
    getPostById,
    addPost,
    deletePost,
    updatePost,
    addComment,
    getComments,
    deleteComment

} = require('../utils/post_utilities');
const {
    userAuthenticated
} = require('../utils/common_utilities');


const getPosts = function (req, res) {
    // execute the query from getAllPosts
    getAllPosts(req).
    sort({
        modified_date: -1
    }).
    exec((err, posts) => {
        if (err) {
            res.status(500);
            res.json({
                error: err.message
            });
        }
        res.send(posts);
    });
};

const getPost = function (req, res) {
    // execute the query from getPostById
    getPostById(req).exec((err, post) => {
        if (err) {
            res.status(404);
            res.send("Post not found");
        }
        res.send(post);
    });
};

const getCommentsFromPost = function (req, res) {
    if(req.error) {
        res.status(req.error.status)
        res.send(req.error.message)
    } else {
        getComments(req).then(( post) => {
            res.status(200)
            res.send(post);
        });
    }
    
}
const makePost = function (req, res) {
    // add the username from req.user
    req.body.username = req.user.username;
    // save the Post instance from addPost
    addPost(req).save((err, post) => {
        if (err) {
            res.status(500);
            res.json({
                error: err.message
            });
        }
        res.status(201);
        res.send(post);
    });
};

const removePost = function (req, res) {
    // Check for error from middleware
    if (req.error) {
        res.status(req.error.status);
        res.send(req.error.message);
    } else {
        // execute the query from deletePost
        deletePost(req.params.id).exec((err) => {
            if (err) {
                res.status(500);
                res.json({
                    error: err.message
                });
            }
            res.sendStatus(204);
        });
    }
};

const changePost = function (req, res) {
    // Check for error from middleware
    if (req.error) {
        res.status(req.error.status);
        res.send(req.error.message);
    } else {
        // execute the query from updatePost
        updatePost(req).exec((err, post) => {
            if (err) {
                res.status(500);
                res.json({
                    error: err.message
                });
            }
            res.status(200);
            res.send(post);
        });
    }
};

const verifyOwner = function (req, res, next) {
    // If post owner isn't currently logged in user, send forbidden
    if (req.user.role === 'admin') {
        console.log('have admin user in middleware')
        next();
    } else {
        getPostById(req).exec((err, post) => {
            if (err) {
                req.error = {
                    message: 'Post not found',
                    status: 404
                }
                next();
            }
            console.log("user: "+req.user.username)
            console.log("post user: "+ post.username)
            if (req.user.username !== post.username) {
                req.error = {
                    message: 'You do not have permission to modify this post',
                    status: 403
                };
            }
            next();
        });
    }
}

const verifyCommentOwner = function (req, res, next) {
    if (req.user.role === 'admin') {
        console.log('have admin user in middleware')
        next();
    } else {
        let post = Post.findOne({
            "comments._id": req.params.id
        }).exec((err, post) => {
            if (err) {
                req.error = {
                    message: 'Post not found',
                    status: 404
                }
                next();
            }
            console.log("post:", post)
            let comment = post.comments.id(req.params.id);
            if (req.user.username !== comment.username) {
                req.error = {
                    message: 'You do not have permission to modify this comment',
                    status: 403
                };
            }
            next();
        });
    }
}

const validUser = function (req, res, next) {
    // If user is blocked, send back an error
    if (req.user.blocked) {
        req.error = {
            message: 'User is blocked',
            status: 403
        };
    }
    next();
}

// make a comment on a post
const makeComment = function (req, res) {
    // Check for error from middleware
    if (req.error) {
        res.status(req.error.status);
        res.send(req.error.message);
    } else {
        // resolve the promise from addComment
        // Add username to the request from the session
        req.body.username = req.user.username;
        addComment(req).then((post) => {
            res.status(200);
            res.send(post);
        }).catch((err) => {
            res.status(500);
            res.json({
                error: err.message
            });
        });
    }
}

const removeComment = function (req, res) {
    // Check for error from middleware
    if (req.error) {
        res.status(req.error.status);
        res.send(req.error.message);
    } else {
        deleteComment(req).then(() => {
            res.sendStatus(204);
        }).catch((err) => {

            res.status(500);
            res.json({
                error: err.message
            });


        })
    }
}

module.exports = {
    getPosts,
    getPost,
    makePost,
    removePost,
    changePost,
    verifyOwner,
    validUser,
    makeComment,
    getCommentsFromPost,
    removeComment,
    verifyCommentOwner
    
};