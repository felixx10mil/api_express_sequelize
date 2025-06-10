import createError from 'http-errors';
/**
 * Is user
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns true/false
 */

const checkUserById = async (req, res, next) => {
	try {
		// Verifica que el usuario autenticado sea el mismo del parametro enviado
		if (req.user !== Number.parseInt(req.params.id)) {
			return next(createError(403, 'UNAUTHORIZED_USER'));
		}
		next();
	} catch (e) {
		return next(createError('UNAUTHORIZED_USER'));
	}
};

module.exports = checkUserById;
