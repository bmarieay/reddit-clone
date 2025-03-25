import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AvatarImgSchema = new Schema({
    url: String,
    filename: String
});

const CoverImgSchema = new Schema({
    url: String,
    filename: String
});

const UserSchema = new Schema({
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
    }
}, {timestamps: true});

const User = mongoose.model('user', UserSchema);
export default User;