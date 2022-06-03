import expressJwt from "express-jwt";
import User from "../models/user";

export const requireSignin = expressJwt({
    getToken: (req, res) => req.headers.authorization,
    secret: process.env.SECRET,
    algorithms: ["HS256"],
});
export const isAdmin = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.user._id).exec();
        console.log(currentUser.role.includes('Admin'))
        if (!currentUser.role.includes("Admin")) {
            return res.status(403).json({ ok: false, message: 'You are not admin' });
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
    }
};