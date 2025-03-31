import Notification from "../models/notification.model.js"
import User from "../models/user.model.js";

export const getNotifications = async(req, res) => {
    const userId = req.user._id;
    const notifications = await Notification.find({to: userId})
    .populate({
        path: "from", model: User,
        select: "username avatarImg"
    });

    await Notification.updateMany({to: userId}, {read: true});
    res.status(200).json(notifications);
}


export const deleteNotification = async(req, res) => {
    const {id: notificationId} = req.params;
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({message: "Notification deleted successfully"});
}