import mongoose from "mongoose";
const Schema = mongoose.Schema;

const voteSchema = new Schema({
    resourceType:{
        type: String,
        enum: ['Comment', 'Post'],
        required: true
    },
    resourceId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'resourceType'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    voteType: {
        type: String,
        enum: ['upvote', 'downvote'],
        required: true
    }
})

//middleware to delete existing vote for same resource and owner
voteSchema.pre('save', async function(){
    await Vote.findOneAndDelete({
        owner: this.owner, 
        resourceType: this.resourceType, 
        resourceId: this.resourceId}
    );
})

const Vote = mongoose.model('vote', voteSchema);
export default Vote;