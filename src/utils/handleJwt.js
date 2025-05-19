import 'dotenv/config';
import jwt from 'jsonwebtoken';

/**
 * Payload and time expire
 * @param {*} user
 * @param {*} expire
 * @returns
 */
const signToken = async (user, expire) => {
	const token = jwt.sign(user, process.env.JWT_SECRET, {
		expiresIn: expire,
	});
	return token;
};

/**
 * Token
 * @param {*} token
 * @returns
 */
const verifyToken = async token => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (e) {
		return null;
	}
};

module.exports = {
	signToken,
	verifyToken,
};
