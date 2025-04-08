import mongoose from "mongoose";
import Vote from "./vote.model.js";
import Comment from "./comment.model.js";
const Schema = mongoose.Schema;

const postImgSchema = new Schema({
    url: String,
    filename: String
})

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subreddit: {
        type: Schema.Types.ObjectId,
        ref: 'Subreddit',
        required: true
    },
    img: postImgSchema,
}, {timestamps: true});

//delete the votes linked to the post
//delete the parent comments linked to the post
postSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Vote.deleteMany({
            resourceId: doc._id,
            resourceType: 'Post'
        });
        await Comment.deleteParentCommentAndChildren(doc._id);
    }
})

const Post = mongoose.model('post', postSchema);
export default Post;