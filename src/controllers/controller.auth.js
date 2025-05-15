import createError from 'http-errors';
import { matchedData } from 'express-validator';
import serviceAuth from '../services/service.auth.js';
import { response } from 'express';

/**
 * Signup
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const signup = async (req, res, next) => {
	// Data
	const { email, password } = matchedData(req);

	try {
		const response = await serviceAuth.signup(email, password);
		res.status(201).json({
			status: 'OK',
			data: [],
			message: response,
		});
	} catch (e) {
		return next(createError(e?.status || 500, e?.message || 'ERROR'));
	}
};

/**
 * Signin
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const signin = async (req, res, next) => {
	// Data
	const { email, password } = matchedData(req);
	try {
		const { user, token } = await serviceAuth.signin(email, password);

		// Genera una cookie
		const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
		res.cookie('access_token', token, {
			secure: false,
			httpOnly: true,
			domain: 'example.com',
			path: 'foo/bar',
			expires: expiryDate,
		});

		res.status(200).json({
			status: 'OK',
			data: {
				user,
				token,
			},
			message: 'You are successfully logged in.',
		});
	} catch (e) {
		return next(createError(e?.status || 500, e?.message || 'ERROR'));
	}
};

/**
 * Confirm email
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const confirmAccount = async (req, res, next) => {
	// Data
	const { token } = matchedData(req);

	try {
		const response = await serviceAuth.confirmAccount(token);
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
 * Forgot password
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const forgotPassword = async (req, res, next) => {
	// Data
	const { email } = matchedData(req);

	try {
		const response = await serviceAuth.forgotPassword(email);
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
 * Reset password
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const resetPassword = async (req, res, next) => {
	const { token, password } = matchedData(req);

	try {
		const response = await serviceAuth.resetPassword(token, password);
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
	signup,
	signin,
	confirmAccount,
	forgotPassword,
	resetPassword,
};
