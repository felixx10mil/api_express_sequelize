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
		return res
			.status(400)
			.json({ message: 'The request is not valid.', errors: err.mapped() });
	}
};

module.exports = validateResults;
