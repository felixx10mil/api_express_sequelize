import createError from 'http-errors';
import { verifyToken } from '../utils/handleJwt.js';

/**
 * check Token Cookie
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const checkTokenCookie = async (req, res, next) => {
	const token = req.cookies.access_token || '';
	if (!token) {
		return next(createError(404, 'NOT_TOKEN'));
	}
	try {
		const dataToken = await verifyToken(token, process.env.SECRET_SESSION);
		req.user = dataToken.user;
		req.roles = dataToken.roles;
		next();
	} catch (e) {
		return next(createError('INVALID_TOKEN'));
	}
};

module.exports = checkTokenCookie;
