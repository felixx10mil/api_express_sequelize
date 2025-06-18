import jwt from 'jsonwebtoken';

/**
 * SignToken
 * @param {*} peyload
 * @param {*} secret
 * @param {*} expire
 * @returns
 */
const signToken = async (peyload, secret, expire) => {
	const token = jwt.sign(peyload, secret, {
		expiresIn: expire,
	});
	return token;
};

/**
 * verifyToken
 * @param {*} token
 * @param {*} secret
 * @returns
 */
const verifyToken = async (token, secret) => {
	try {
		return jwt.verify(token, secret);
	} catch (e) {
		return null;
	}
};

module.exports = {
	signToken,
	verifyToken,
};
