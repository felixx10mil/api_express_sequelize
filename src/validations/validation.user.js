import { check, param } from 'express-validator';
import validateResults from './validateResult.js';

const paramsId = [
	param('id')
		.exists()
		.withMessage('Required parameters.')
		.isNumeric()
		.withMessage('Required numeric parameters.'),

	(req, res, next) => validateResults(req, res, next),
];
const updateAccount = [
	check('currentPassword')
		.exists()
		.withMessage('Current Password is required.')
		.notEmpty()
		.withMessage('The current password field cannot be empty.'),
	check('name')
		.exists()
		.withMessage('Name is required.')
		.notEmpty()
		.withMessage('The name field cannot be empty.')
		.isLength({ min: 6 })
		.withMessage('The name field must be 6 digits.'),
	check('email')
		.exists()
		.withMessage('Email is required.')
		.notEmpty()
		.withMessage('The email field cannot be empty.'),

	(req, res, next) => validateResults(req, res, next),
];
const updatePassword = [
	check('currentPassword')
		.exists()
		.withMessage('Current password is required.')
		.notEmpty()
		.withMessage('The Current password field cannot be empty.'),
	check('newPassword')
		.exists()
		.withMessage('New password is required')
		.notEmpty()
		.withMessage('The new password field cannot be empty.')
		.matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{7,12}$/)
		.withMessage('The new password field must be between 7 and 12 digits.'),
	check('confirmPassword')
		.exists()
		.withMessage('Confirm password is required.')
		.notEmpty()
		.withMessage('The confirm password field cannot be empty.')
		.custom((value, { req }) => value === req.body.newPassword)
		.withMessage('Password confirmation does not match.'),

	(req, res, next) => validateResults(req, res, next),
];
const updateProfile = [
	check('first_name')
		.exists()
		.withMessage('First name is required.')
		.notEmpty()
		.withMessage('The name field cannot be empty.'),
	check('last_name')
		.exists()
		.withMessage('Last name is required.')
		.notEmpty()
		.withMessage('The last name field cannot be empty.'),
	check('biography')
		.exists()
		.withMessage('Biography is required.')
		.notEmpty()
		.withMessage('The Current password field cannot be empty.'),

	(req, res, next) => validateResults(req, res, next),
];

module.exports = {
	paramsId,
	updateAccount,
	updatePassword,
	updateProfile,
};
