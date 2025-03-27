import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;
const AvatarImgSchema = new Schema({
    url: String,
    filename: String
});

const CoverImgSchema = new Schema({
    url: String,
    filename: String
});

const userSchema = new Schema({
    avatarImg: AvatarImgSchema,
    coverImg: CoverImgSchema,
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    links: {
        type: String
    },
    aboutMe: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    belongsToSubreddit: {
        type: Schema.Types.ObjectId,
        ref: 'Subreddit'
    }
}, {timestamps: true});

userSchema.statics.findAndValidate = async(username, password) => {
    const foundUser = await User.findOne({username});
    const isValidPassword = await bcrypt.compare(password, foundUser?.password || "");

    return isValidPassword ? foundUser : false;
}

const User = mongoose.model('user', userSchema);
export default User;