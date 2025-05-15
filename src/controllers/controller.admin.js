import createError from 'http-errors';
import { matchedData } from 'express-validator';
import serviceAdmin from '../services/service.admin.js';

/**
 * Get all users
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

export const getAllUsers = async (req, res, next) => {
	try {
		const users = await serviceAdmin.getAllUsers();
		res.status(200).json({
			status: 'OK',
			users: users,
		});
	} catch (e) {
		return next(createError(e?.status || 500, e?.message || 'ERROR'));
	}
};

/**
 * Get all users
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const getAllRoles = async (req, res, next) => {
	const { id } = matchedData(req);
	try {
		const roles = await serviceAdmin.getAllRoles(parseInt(id));
		res.status(200).json({
			status: 'OK',
			roles: roles,
		});
	} catch (e) {
		return next(createError(e?.status || 500, e?.message || 'ERROR'));
	}
};

/**
 * Update status
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const updateUserStatus = async (req, res, next) => {
	const { id, ...body } = matchedData(req);
	try {
		const response = await serviceAdmin.updateUserStatus(parseInt(id), body);
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
 * Update roles
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const updateUserRole = async (req, res, next) => {
	const { id, ...body } = matchedData(req);
	try {
		const response = await serviceAdmin.updateUserRole(parseInt(id), body);
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
 * Delete user
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const deleteUser = async (req, res, next) => {
	const { id, ...body } = matchedData(req);

	try {
		const response = await serviceAdmin.deleteUser(parseInt(id), body);
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
	getAllUsers,
	getAllRoles,
	updateUserStatus,
	updateUserRole,
	deleteUser,
};
