import Post from "../models/post.model.js"
import Subreddit from "../models/subreddit.model.js";
import User from "../models/user.model.js";
import Vote from "../models/vote.model.js";
import Comment from "../models/comment.model.js";
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
    const {sort} = req.query;
    const foundPost = await Post.findById(id)
    .populate({
        path: "createdBy", model: User,
        select: "username"
    })
    .populate({
        path: "subreddit", model: Subreddit,
        select: "title"
    });
    let filter = {createdAt: 1};
    if(sort === 'top'){
        filter.createdAt = -1;
    }
    //find the parent comments
    const comments = await Comment.find({post: foundPost._id})
    .populate({
        path: "commentator", model: User,
        select: "username"
    }).sort(filter);
    


    // const baseUrl = url.format({
    //     protocol: req.protocol,
    //     hostname: req.hostname,
    //     pathname: req.originalUrl
    // });
    // const fullUrl = `${baseUrl}/${foundPost.title}`
 
    res.status(200).json({foundPost, comments});
}

export const upvoteDownvotePost = async(req, res) => {
    const {id: postId} = req.params;
    const userId = req.user._id;
    const isUpvote = await Vote.findOne({
        owner: userId, 
        resourceType: "Post", 
        resourceId: postId,  
        voteType: "upvote"});

    if(!isUpvote){
        const upVote = new Vote({
            resourceType: "Post", 
            resourceId: postId,
            owner: userId,
            voteType: "upvote"
        });
        await upVote.save();
    } else {
        const downVote = new Vote({
            resourceType: "Post", 
            resourceId: postId,
            owner: userId,
            voteType: "downvote"
        });
        await downVote.save();
    }
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