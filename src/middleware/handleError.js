import logger from '../utils/handleLogger.js';

/**
 * Handle http error
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const handleHttpError = (err, req, res, next) => {
	logger.error(err.message);
	res.status(err.status || 500).json({
		status: 'FAILED',
		error: {
			message: err.message || 'INTERNAL_SERVER_ERROR',
		},
	});
};

/**
 * Handle Error 404
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const handleError404 = (req, res, next) => {
	logger.error(res.message || 'Page not found');
	res.status(404).json({
		status: 'FAILED',
		error: {
			message: 'Page not found',
		},
	});
};

module.exports = { handleHttpError, handleError404 };
