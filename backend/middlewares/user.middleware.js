import User from "../models/user.model.js";
import NotFoundEror from "../utils/errors/NotFoundError.js";

export const checkIfUserExists = async(req, res, next) => {
    const {username} = req.params;
    const user = await User.findOne({username});
    if(!user) return next(new NotFoundEror("User not found"));
    next();
}