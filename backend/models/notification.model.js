import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['subreddit', 'upvote'],
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});


const Notification = mongoose.model('notification', notificationSchema);
export default Notification;