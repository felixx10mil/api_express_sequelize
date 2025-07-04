import { validationResult } from 'express-validator';

/**
 * Validate request
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns errores de validación
 */
const validateResults = (req, res, next) => {
	try {
		validationResult(req).throw();
		return next();
	} catch (err) {
		throw {
			status: 400,
			message: 'THE_REQUEST_IS_NOT_VALID',
		};
	}
};

module.exports = validateResults;
