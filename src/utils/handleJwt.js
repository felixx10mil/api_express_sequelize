import jwt from 'jsonwebtoken';

/**
 * SignToken
 * @param {*} peyload
 * @param {*} secret
 * @param {*} expire
 * @returns
 */

function signToken(peyload, secret, expire = '1h') {
	return jwt.sign(peyload, secret, {
		expiresIn: expire,
	});
}

/**
 * verifyToken
 * @param {*} token
 * @param {*} secret
 * @returns
 */

function verifyToken(token, secret) {
	try {
		return jwt.verify(token, secret);
	} catch (e) {
		return null;
	}
}

module.exports = {
	signToken,
	verifyToken,
};
