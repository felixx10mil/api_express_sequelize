import { check, param } from 'express-validator';
import validateResults from './validateResult.js';

const paramsId = [
	param('id').exists().isNumeric(),
	(req, res, next) => validateResults(req, res, next),
];
const updateAccount = [
	check('currentPassword').exists().notEmpty(),
	check('name').exists().notEmpty().isLength({ min: 6 }),
	check('email').exists().notEmpty(),
	(req, res, next) => validateResults(req, res, next),
];
const updatePassword = [
	check('currentPassword').exists().notEmpty(),
	check('newPassword')
		.exists()
		.notEmpty()
		.matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{7,12}$/),
	check('confirmPassword')
		.exists()
		.notEmpty()
		.custom((value, { req }) => value === req.body.newPassword),

	(req, res, next) => validateResults(req, res, next),
];
const updateProfile = [
	check('first_name').exists().notEmpty().isAlpha(),
	check('last_name').exists().notEmpty().isAlpha(),
	check('biography').exists().notEmpty(),
	(req, res, next) => validateResults(req, res, next),
];

module.exports = {
	paramsId,
	updateAccount,
	updatePassword,
	updateProfile,
};
