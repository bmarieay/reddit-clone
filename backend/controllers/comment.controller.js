import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Vote from "../models/vote.model.js";


export const createComment = async(req, res) => {
    const {text} = req.body;
    const {id: postId} = req.params;
    const post = await Post.findById(postId);
    const newComment = new Comment({
        text,
        commentator: req.user._id,
        post: post._id
    });
    await newComment.save();
    res.status(201).json(newComment);
}

//todo: topological sort for comment viewing
export const viewComment = async(req, res) => {
    const{commentId} = req.params;
    const comment = await Comment.findById(commentId)
    .populate({
        path: "commentator", model: User, 
        select: "username"
    })
    .populate({
        path: "parentComment", model: Comment
    });
    res.status(200).json(comment);
}

export const replyToComment = async(req, res) => {
    const {commentId} = req.params;
    const {text} = req.body;
    const parentComment = await Comment.findById(commentId);
    const newComment = new Comment({
        text,
        commentator: req.user._id,
        parentComment: parentComment._id
    });
    await newComment.save();
    res.status(201).json(newComment);
}

export const upvoteDownVoteComment = async(req, res) => {
    const {commentId} = req.params;
    const userId = req.user._id;
    const isUpvoted = await Vote.findOne({
        owner: userId, 
        resourceType: "Comment", 
        resourceId: commentId,  
        voteType: "upvote"});
        
    if(!isUpvoted) {
        const upVote = new Vote({
            resourceType: "Comment", 
            resourceId: commentId,
            owner: userId,
            voteType: "upvote"
        });
        await upVote.save();
    } else {
        const downVote = new Vote({
            resourceType: "Comment", 
            resourceId: commentId,
            owner: userId,
            voteType: "downvote"
        });
        await downVote.save();
    }

    res.status(200).json({message: `Comment ${!isUpvoted ? "upvoted" : "dowvoted"}`});
}

export const updateComment = async(req, res) => {
    const {commentId} = req.params;
    const comment = await Comment.findByIdAndUpdate(commentId, {text: req.body.text}, {new: true});
    res.status(201).json(comment);
}

export const deleteComment = async(req, res) => {
    const {commentId} = req.params;
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({message: "Comment deleted"});
}