import Subreddit from "../models/subreddit.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import ExpressError from "../utils/errors/ExpressError.js";
import NotFoundEror from "../utils/errors/NotFoundError.js";
import UnauthorizedError from "../utils/errors//UnauthorizedError.js";
import Notification from "../models/notification.model.js";

export const createSubreddit = async(req, res) => {
    const newSubreddit = new Subreddit(req.body);
    newSubreddit.author = req.user._id;
    newSubreddit.members++;
    await User.findByIdAndUpdate(req.user._id, {$push: {belongsToSubreddit: newSubreddit._id}});
    await newSubreddit.save();
    res.status(201).json({message: "Subreddit created successfully"});
}

export const deleteSubreddit = async(req, res) => {
    //delete the subreddit and remove references from user
    const subreddit = await Subreddit.findByIdAndDelete(req.params.id);
    const query = {belongsToSubreddit: subreddit._id};
    const recipients = await User.find(query);
    await User.updateMany(query, {$pull: query}, {new: true});

    //send notifs to members that the subreddit is no longer available
    let notificationsToInsert = [];
    for (let recipient of recipients) {
        const recipientId = recipient._id;
        if(recipientId.equals(subreddit.author)) continue;
        let doc = { from: subreddit.author, type: 'subreddit' };
        doc["to"] = recipientId;
        doc["text"] = `r/${subreddit.title} is no longer available`
        notificationsToInsert.push(doc);
    }
    await Notification.insertMany(notificationsToInsert);
    res.status(200).json({message: "Subreddit deleted successfully"});
}

export const updateSubreddit = async(req, res) => {
    const subreddit = await Subreddit.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json(subreddit);
}

//todo: add a middleware for posts to auto populate when querying
//implement pagination
export const viewSubreddit = async(req, res) => {
    const {subreddit} = req.params;
    const matchingSubreddit = await Subreddit.findOne({title: subreddit});
    if(!matchingSubreddit ) throw new NotFoundEror(`Subreddit r/${subreddit} does not exist`);
    const posts = await Post.find({subreddit: matchingSubreddit._id})
    .populate({
        path: "createdBy", model: User,
        select: "username"
    });
    res.status(200).json({...matchingSubreddit._doc, posts});
}

//todo: maybe add db middleware when selecting user
export const joinUnjoinSubreddit = async(req, res) => {
    const {subreddit} = req.params;
    const matchingSubreddit = await Subreddit.findOne({title: subreddit});
    if(!matchingSubreddit ) throw new NotFoundEror(`Subreddit r/${subreddit} does not exist`);
    
    const user = await User.findById(req.user._id).select("-password");
    if(!user) throw new ExpressError();
    const userIsMember = user.belongsToSubreddit.includes(matchingSubreddit._id);
    const authorId = matchingSubreddit.author;
    const loggedInUserId = user._id;
    if(authorId.equals(loggedInUserId)) throw new UnauthorizedError("The author can not perform this action");
    const subredditId = matchingSubreddit._id;


    if(!userIsMember){
        //if not a member then add the user, increase the subreddit's member count, and create a notification
        const updatedUser = await User.findByIdAndUpdate(loggedInUserId, 
            {$push: {belongsToSubreddit: subredditId}}, {new: true}).select("-password");
        await Subreddit.findByIdAndUpdate(subredditId, {$inc: {members: 1}});
        const notification = new Notification({
            from: loggedInUserId,
            to: authorId,
            type: 'subreddit',
            text: `${user.username} has joined r/${matchingSubreddit.title} subreddit`
        });
        await notification.save();
        res.status(200).json(updatedUser);

    } else {
        //if a member, remove the reference from user and decrease the subreddit's member count
        // user.belongsToSubreddit.push(subredditId);
        const updatedUser = await User.findByIdAndUpdate(loggedInUserId, 
            {$pull: {belongsToSubreddit: subredditId}}, {new: true}).select("-password");
        await Subreddit.findByIdAndUpdate(subredditId, {$inc: {members: -1}});
        await matchingSubreddit.save();
        // await user.save();
        res.status(200).json(updatedUser);
    }
}