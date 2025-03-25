import jwt from 'jsonwebtoken';
import ms from 'ms';

const createToken = (userId, res) => {
    const maxCookieAge = '2d';
    const jwtToken = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: maxCookieAge
    });
    res.cookie('_kt', jwtToken, {
        maxAge: ms(maxCookieAge),
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    });
}

export default createToken;

