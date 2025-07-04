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
	const status = err.status || 500;
	logger.error(status + '-' + err.message);
	res.status(status).json({
		status: status,
		message: 'Something went wrong!',
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
	logger.error(res.message || 'Page not found!');
	res.status(404).json({
		status: 404,
		message: 'Page not found!',
	});
};

module.exports = { handleHttpError, handleError404 };
