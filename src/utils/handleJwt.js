import 'dotenv/config';
import jwt from 'jsonwebtoken';

/**
 * Recibe id de usuario y tiempo de expiración (1,1h)
 * @param {*} user
 * @param {*} expire
 * @returns token
 */
const signToken = async (user, expire) => {
	const token = jwt.sign(user, process.env.JWT_SECRET, {
		expiresIn: expire,
	});
	return token;
};

/**
 * Verify token
 *
 * @param {*} token
 * @returns decode / null
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
