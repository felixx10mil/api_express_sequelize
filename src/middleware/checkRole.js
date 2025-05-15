import createError from 'http-errors';

/**
 * Array with accepted roles
 * @param {*} rol
 * @returns
 */
const checkRole = rol => async (req, res, next) => {
	try {
		// Authenticated user permissions
		const rolesByUserAuth = req.roles;

		const check = rol.some(rolSingle => rolesByUserAuth.includes(rolSingle));
		if (!check) {
			return next(createError(403, 'ACCESS_DENIED'));
		}
		next();
	} catch (e) {
		return next(createError(403, 'ACCESS_DENIED_ERROR'));
	}
};

module.exports = checkRole;
