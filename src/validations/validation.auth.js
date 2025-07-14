import { check } from 'express-validator';
import validateResults from './validateResult.js';

const signup = [
	check('firstName').exists().notEmpty().isAlpha(),
	check('lastName').exists().notEmpty().isAlpha(),
	check('email').exists().notEmpty().isEmail(),
	check('password')
		.exists()
		.notEmpty()
		.matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{7,12}$/),
	check('confirmPassword')
		.exists()
		.notEmpty()
		.custom((value, { req }) => value === req.body.password),
	(req, res, next) => validateResults(req, res, next),
];
const login = [
	check('email').exists().notEmpty().isEmail(),
	check('password').exists().notEmpty(),
	(req, res, next) => validateResults(req, res, next),
];
const v2fa = [
	check('token').exists().notEmpty().isJWT(),
	check('code').exists().notEmpty(),
	(req, res, next) => validateResults(req, res, next),
];
const resetPassword = [
	check('token').exists().notEmpty().isJWT(),
	check('password')
		.exists()
		.notEmpty()
		.matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{7,12}$/),
	check('confirmPassword')
		.exists()
		.notEmpty()
		.custom((value, { req }) => value === req.body.password),
	(req, res, next) => validateResults(req, res, next),
];
const email = [
	check('email').exists().notEmpty().isEmail(),
	(req, res, next) => validateResults(req, res, next),
];
const token = [
	check('token').exists().notEmpty().isJWT(),
	(req, res, next) => validateResults(req, res, next),
];

module.exports = {
	signup,
	login,
	v2fa,
	resetPassword,
	email,
	token,
};
