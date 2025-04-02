import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    commentator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    upVotes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});
const Comment = mongoose.model('comment', commentSchema);
export default Comment;