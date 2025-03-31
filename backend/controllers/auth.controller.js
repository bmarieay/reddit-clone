import User from "../models/user.model.js";
import createToken from "../utils/cookies/createToken.js";

import bcrypt from "bcryptjs";

// 'auth/me'
export const getMe = async(req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
}

// 'auth/login'
export const login = async(req, res) => {
    //todo: add a middleware for redirects
    const {username, password} = req.body;
    const validatedUser = await User.findAndValidate(username, password);
    if(!validatedUser) return res.status(400).json({error: "Invalid credentials"});

    createToken(validatedUser._id, res);
    res.status(200).json({message:"Logged in successfully"});   
}

// 'auth/logout'
export const logout = async(req, res) => {
    res.cookie('_kt', "", {maxAge: 0});
    res.status(200).json({message: "Logged out successfully"});
}

// 'auth/signup'
export const signup = async(req, res) => {
    const {username, password, email} = req.body;
    //hash the password
    const hashedPass = await bcrypt.hash(password, 12);
    const newUser = new User({
        username,
        email,
        password: hashedPass,
    });
    const userId = newUser._id;
    //create a token for session
    createToken(userId, res);
    //once token is established, save the user
    await newUser.save();
    res.status(200).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        links: newUser.links,
        aboutMe: newUser.aboutMe,
        avatarImg: newUser.avatarImg,
        coverImg: newUser.coverImg
    });
}
