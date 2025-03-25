import express from 'express';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';

import connectToMongoDB from './database/connectToMongoDB.js';
import createToken from './utils/cookies/createToken.js';

dotenv.config();
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

app.post('/signup', async(req, res) => {
    const {username, password, email} = req.body;
    //hash the password
    const hashedPass = await bcrypt.hash(password, 12);
    console.log(hashedPass);
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
});

app.get('/me', async(req, res) => {
    //todo: move as a middleware
    //and add custom error handlers
    const token = req.cookies._kt;
    if(!token) res.status(401).json({error: "No token"});

    const isValidToken = jwt.verify(token, process.env.JWT_SECRET);
    if(!isValidToken) res.status(401).json({error: "No token"});

    const user = await User.findById(isValidToken.userId).select("-password")
    if(!user) res.status(404).json({error: "User not found"});

    req.user = user;
    console.log(req.user)
    res.status(200).json(user);
})

app.post('/login', async(req, res) => {
    //todo: move as mongoose statics, maybe add a middleware for req.user for redirects
    const {username, password} = req.body;
    const foundUser = await User.findOne({username});
    const isValidPassword = await bcrypt.compare(password, foundUser?.password || "");
    if(!isValidPassword){
        res.status(400).json({error: "Invalid credentials"});
    } else {
        createToken(foundUser._id, res);
        res.status(200).json({message:"logged in"});
    }
})

app.post('/logout', (req, res) => {
    res.cookie('_jkt', "", {maxAge: 0});
    res.status(200).json({message: "Logged out successfully"});
})


app.listen(PORT, () => {
    console.log(`Serving PORT ${PORT}`);
    connectToMongoDB();
})