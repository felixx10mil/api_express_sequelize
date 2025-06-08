import createError from 'http-errors';
//import { matchedData } from 'express-validator';
import servicePayment from '../services/service.payment.js';

/**
 * Create payment
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const createPayment = async (req, res, next) => {
	try {
		const response = await servicePayment.createPayment();
		res.status(200).json({
			status: 'OK',
			data: [],
			message: response,
		});
	} catch (e) {
		return next(createError(e?.status || 500, e?.message || 'ERROR'));
	}
};

module.exports = {
	createPayment,
};
