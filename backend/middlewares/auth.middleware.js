import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const authenticateUser = async(req, res, next) => {
    const token = req.cookies._kt;
    if(!token) return res.status(401).json({error: "No token"});

    const isValidToken = jwt.verify(token, process.env.JWT_SECRET);
    if(!isValidToken) return res.status(401).json({error: "No token"});
    console.log(isValidToken);
    const user = await User.findById(isValidToken.userId).select("-password")
    if(!user) return res.status(404).json({error: "User not found"});
    req.user = user;

    next();
}