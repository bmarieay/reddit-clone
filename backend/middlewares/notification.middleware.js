import Notification from "../models/notification.model.js";
import NotFoundEror from "../utils/errors/NotFoundError.js";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";

export const isNotificationOwner = async(req, res, next) => {
    const notification = await Notification.findById(req.params.id);
    if(!notification) return next(new NotFoundEror("Notification can not be found"));
    if(!notification.to.equals(req.user._id)) return next(new UnauthorizedError());
    next();
}