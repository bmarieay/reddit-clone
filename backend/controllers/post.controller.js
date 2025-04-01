import Post from "../models/post.model.js"
import Subreddit from "../models/subreddit.model.js";
import User from "../models/user.model.js";
// import url from 'node:url';

export const createPost = async(req, res) => {
    const {subreddit} = req.params;
    const foundSubreddit = await Subreddit.findOne({title: subreddit});
    const {title, text, img} = req.body;
    const userId = req.user._id;
    const newPost = new Post({
        title,
        text,
        img,
        createdBy: userId,
        subreddit: foundSubreddit._id
    });
    await newPost.save();
    res.status(201).json({message: "Post created successfully"});
}

export const viewPost = async(req, res) => {
    const {id} = req.params;
    const foundPost = await Post.findById(id)
    .populate({
        path: "createdBy", model: User,
        select: "username"
    })
    .populate({
        path: "subreddit", model: Subreddit,
        select: "title"
    })
    // const baseUrl = url.format({
    //     protocol: req.protocol,
    //     hostname: req.hostname,
    //     pathname: req.originalUrl
    // });
    // const fullUrl = `${baseUrl}/${foundPost.title}`
 
    res.status(200).json(foundPost);
}

export const upvoteDownvotePost = async(req, res) => {
    const {id: postId} = req.params;
    const post = await Post.findById(postId);
    const userId = req.user._id;
    const isUpvote = post.upVotes.includes(userId);
    if(!isUpvote) await Post.findByIdAndUpdate(postId, {$push: {upVotes: userId}});
    else await Post.findByIdAndUpdate(postId, {$pull: {upVotes: userId}});
    res.status(201).json({message: `Post ${!isUpvote ? "upvoted" : "downvoted"}`}); 
}

export const editPost = async(req, res) => {
    const {id} = req.params;
    const {title, text} = req.body;
    const updatedPost = await Post.findByIdAndUpdate(id, {
        title,
        text
    }, {new: true});
    res.status(200).json(updatedPost);
}

export const deletePost = async(req, res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    res.status(200).json({message: "Post deleted successfully"});
}