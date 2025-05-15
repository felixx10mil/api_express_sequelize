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
const updateStatus = [
	check('status')
		.exists()
		.withMessage('Status is required.')
		.notEmpty()
		.withMessage('The status field cannot be empty.')
		.isIn(['active', 'inactive'])
		.withMessage('The selected option is not valid.'),

	(req, res, next) => validateResults(req, res, next),
];
const updateRole = [
	check('roles')
		.exists()
		.withMessage('Roles is required.')
		.notEmpty()
		.withMessage('The roles field cannot be empty.')
		.isArray()
		.withMessage('The selected option is not valid.'),

	(req, res, next) => validateResults(req, res, next),
];
const deleteAccount = [
	check('email')
		.exists()
		.withMessage('Email is required.')
		.notEmpty()
		.withMessage('The email field cannot be empty.')
		.isEmail()
		.withMessage('The email is invalid.'),

	(req, res, next) => validateResults(req, res, next),
];

module.exports = {
	paramsId,
	updateStatus,
	updateRole,
	deleteAccount,
};
