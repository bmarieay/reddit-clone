import Subreddit from "../models/subreddit.model.js";

export const createSubreddit = async(req, res) => {
    const newSubreddit = new Subreddit(req.body);
    await newSubreddit.save();
    res.status(200).json({message: "Subreddit created successfully"});
}