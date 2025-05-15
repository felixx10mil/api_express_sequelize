import { check } from 'express-validator';
import { User } from '../models/index.js';
import validateResults from './validateResult.js';

const signup = [
	check('email')
		.exists()
		.withMessage('The email field is required.')
		.notEmpty()
		.withMessage('The email field cannot be empty.')
		.isEmail()
		.withMessage('The email is invalid.')
		.custom(async value => {
			// TODO:es posible que esta capa pueda acceder a la DB 👇👇
			const user = await User.findOne({ where: { email: value } });
			if (user) {
				throw new Error('Email already registered.');
			}
		}),
	check('password')
		.exists()
		.withMessage('The password field is required.')
		.notEmpty()
		.withMessage('The password field cannot be empty.')
		.matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{7,12}$/)
		.withMessage('The password field must be between 7 and 12 digits.'),
	check('confirmPassword')
		.exists()
		.withMessage('The Confirm password field is required.')
		.notEmpty()
		.withMessage('The Confirm password field cannot be empty.')
		.custom((value, { req }) => value === req.body.password)
		.withMessage('Password confirmation does not match.'),

	(req, res, next) => validateResults(req, res, next),
];
const signin = [
	check('email')
		.exists()
		.withMessage('The email field is required.')
		.notEmpty()
		.withMessage('The email field cannot be empty.')
		.isEmail()
		.withMessage('The email is invalid.'),
	check('password')
		.exists()
		.withMessage('The password field is required.')
		.notEmpty()
		.withMessage('The password field cannot be empty.'),

	(req, res, next) => validateResults(req, res, next),
];
const confirmAccount = [
	check('token')
		.exists()
		.withMessage('The token field is required.')
		.notEmpty()
		.withMessage('The token field cannot be empty.')
		.isJWT()
		.withMessage('The token is invalid.'),
	(req, res, next) => validateResults(req, res, next),
];
const forgotPassword = [
	check('email')
		.exists()
		.withMessage('The email field is required.')
		.notEmpty()
		.withMessage('The email field cannot be empty.')
		.isEmail()
		.withMessage('The email is invalid.')
		.custom(async value => {
			// TODO:es posible que esta capa pueda acceder a la DB
			const searchEmail = await User.findOne({ where: { email: value } });
			if (!searchEmail) {
				throw new Error('Email already registered.');
			}
		}),

	(req, res, next) => validateResults(req, res, next),
];
const resetPassword = [
	check('token')
		.exists()
		.withMessage('The token field is required.')
		.notEmpty()
		.withMessage('The token field cannot be empty.')
		.isJWT()
		.withMessage('The token is invalid.'),
	check('password')
		.exists()
		.withMessage('The password field is required.')
		.notEmpty()
		.withMessage('The password field cannot be empty.')
		.matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{7,12}$/)
		.withMessage('The password field must be between 7 and 12 digits.'),
	check('confirmPassword')
		.exists()
		.withMessage('The Confirm password field is required.')
		.notEmpty()
		.withMessage('The confirm password field cannot be empty.')
		.custom((value, { req }) => value === req.body.password)
		.withMessage('Password confirmation does not match.'),

	(req, res, next) => validateResults(req, res, next),
];

module.exports = {
	signin,
	signup,
	confirmAccount,
	forgotPassword,
	resetPassword,
};
