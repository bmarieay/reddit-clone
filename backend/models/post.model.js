import mongoose from "mongoose";
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
    upVotes: {
        type: Number,
        default: 0
    },
    img: postImgSchema,
}, {timestamps: true});

const Post = mongoose.model('post', postSchema);
export default Post;