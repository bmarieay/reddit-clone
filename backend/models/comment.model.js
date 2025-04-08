import mongoose from "mongoose";
import Vote from "./vote.model.js";
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
    }
}, {timestamps: true});

commentSchema.statics.deleteParentCommentAndChildren = async function(postId){
    const parentComments = await Comment.find({post: postId});
    const parentCommentIds = parentComments.map(comment => comment._id);
    await Comment.deleteMany({post: postId});//parent comments
    const childComments = await Comment.find({parentComment: {$in: parentCommentIds}});
    for(let comment of childComments){
        await Comment.findByIdAndDelete(comment._id);
        await Vote.deleteMany({resourceId: comment._id, resourceType: 'Comment'});
    }
}

//cascade the deletion for infinite nested comments and corresponding votes
commentSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        const childComments = await Comment.find({parentComment: doc._id});
        for(let comment of childComments){
            await Comment.findByIdAndDelete(comment._id);
            await Vote.deleteMany({resourceId: comment._id, resourceType: 'Comment'});
        }
    }
})

const Comment = mongoose.model('comment', commentSchema);
export default Comment;