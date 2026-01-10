import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const generateToken = (payload: object) => {
	const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
		expiresIn: '7d',
	});
	return token;
}