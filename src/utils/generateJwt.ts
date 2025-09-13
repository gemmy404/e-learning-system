import jwt from 'jsonwebtoken'
import {StringValue} from 'ms'

export const generateJwt = (payload: {}, expiresIn: StringValue) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {expiresIn: expiresIn});
    return token;
}