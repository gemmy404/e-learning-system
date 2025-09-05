import jwt from 'jsonwebtoken'
export const generateJwt = async (payload: {}) => {
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY!, {expiresIn: '30m'});
    return token;
}