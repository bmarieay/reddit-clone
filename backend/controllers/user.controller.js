import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import Subreddit from "../models/subreddit.model.js";


export const displayPostsandComments = async(req, res) => {
    const {username} = req.params;
    const user = await User.findOne({username});
    const userId = user._id;
    const posts = await Post.find({createdBy: userId})
    .populate({
        path: "subreddit", model: Subreddit
    });
    const comments = await Comment.find({commentator: userId})
    .populate({
        path: "commentator", model: User,
        select: "username"
    })
    const data = {posts, comments};
    res.status(200).json(data);
}

export const displaySubmittedPosts = async(req, res) => {
    const {username} = req.params;
    const user = await User.findOne({username});
    const userId = user._id;
    const posts = await Post.find({createdBy: userId})
    .populate({
        path: "subreddit", model: Subreddit
    });
    res.status(200).json(posts);
}

export const displayUserComments = async(req, res) => {
    const {username} = req.params;
    const user = await User.findOne({username});
    const userId = user._id;
    const comments = await Comment.find({commentator: userId})
    .populate({
        path: "commentator", model: User,
        select: "username"
    })
    res.status(200).json(comments);
}