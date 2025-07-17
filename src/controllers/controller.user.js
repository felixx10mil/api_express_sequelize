import createError from 'http-errors';
import { matchedData } from 'express-validator';
import serviceUser from '../services/service.user.js';

/**
 * Get user by id
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns user
 */

const getUserById = async (req, res, next) => {
	const { id } = matchedData(req);

	try {
		const user = await serviceUser.getUserById(parseInt(id));
		res.status(200).json({
			status: 'OK',
			user: user,
		});
	} catch (e) {
		return next(createError(e?.status || 500, e?.message || 'ERROR'));
	}
};

/**
 * Update account
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const accountUpdate = async (req, res, next) => {
	const { id, ...body } = matchedData(req);

	try {
		const response = await serviceUser.accountUpdate(parseInt(id), body);
		res.status(200).json({
			status: 'OK',
			data: [],
			message: response,
		});
	} catch (e) {
		return next(createError(e?.status || 500, e?.message || 'ERROR'));
	}
};
/**
 * Update password
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const passwordUpdate = async (req, res, next) => {
	const { id, ...body } = matchedData(req);

	try {
		const response = await serviceUser.passwordUpdate(parseInt(id), body);
		res.status(200).json({
			status: 'OK',
			data: [],
			message: response,
		});
	} catch (e) {
		return next(createError(e?.status || 500, e?.message || 'ERROR'));
	}
};
/**
 * Profile update
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const profileUpdate = async (req, res, next) => {
	const { id, ...body } = matchedData(req);

	try {
		const response = await serviceUser.profileUpdate(parseInt(id), body);
		res.status(200).json({
			status: 'OK',
			data: [],
			message: response,
		});
	} catch (e) {
		return next(createError(e?.status || 500, e?.message || 'ERROR'));
	}
};

/**
 * Photo update
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const photoUpdate = async (req, res, next) => {
	const { filename } = req.file;
	const { id } = matchedData(req);

	try {
		const response = await serviceUser.photoUpdate(parseInt(id), filename);
		res.status(200).json({
			status: 'OK',
			data: [],
			message: response,
		});
	} catch (e) {
		return next(createError(e?.status || 500, e?.message || 'ERROR'));
	}
};

/**
 * Active 2fa
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const active2Fa = async (req, res, next) => {
	const { id, ...body } = matchedData(req);

	try {
		const response = await serviceUser.active2Fa(parseInt(id), body);
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
	getUserById,
	accountUpdate,
	passwordUpdate,
	profileUpdate,
	photoUpdate,
	active2Fa,
};
