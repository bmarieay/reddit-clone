import Post from "../models/post.model.js"
import Subreddit from "../models/subreddit.model.js";
import NotFoundEror from "../utils/errors/NotFoundError.js";

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