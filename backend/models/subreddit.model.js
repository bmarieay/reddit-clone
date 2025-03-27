import mongoose from "mongoose";
const Schema = mongoose.Schema;

const subredditSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    about: {
        type: String,
        required: true
    },
    members: {
        type: Number,
        default: 0
    },
    visibility: {
        type: String,
        required: true,
        enum: ['public', 'private']
    }
});

const Subreddit = mongoose.model('subreddit', subredditSchema);
export default Subreddit;