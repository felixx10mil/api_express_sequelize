import createError from 'http-errors';
import { verifyToken } from '../utils/handleJwt.js';

/**
 * Verify token
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const checkTokenHeader = async (req, res, next) => {
	const header = req.header('Authorization') || '';
	const token = header.split(' ').pop();
	if (!token) {
		return next(createError(404, 'NOT_TOKEN'));
	}

	try {
		// Verifiicar el token
		const dataToken = await verifyToken(token, process.env.SECRET_SESSION);
		req.user = dataToken.user;
		req.roles = dataToken.roles;
		next();
	} catch (e) {
		return next(createError(401, 'INVALID_TOKEN'));
	}
};

module.exports = checkTokenHeader;
