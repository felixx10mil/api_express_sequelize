import { check, param } from 'express-validator';
import validateResults from './validateResult.js';

const paramsId = [
	param('id').exists().isNumeric(),

	(req, res, next) => validateResults(req, res, next),
];
const updateStatus = [
	check('status').exists().notEmpty().isIn(['active', 'inactive']),

	(req, res, next) => validateResults(req, res, next),
];
const updateRole = [
	check('roles').exists().notEmpty().isArray(),

	(req, res, next) => validateResults(req, res, next),
];
const deleteAccount = [
	check('email').exists().notEmpty().isEmail(),

	(req, res, next) => validateResults(req, res, next),
];

module.exports = {
	paramsId,
	updateStatus,
	updateRole,
	deleteAccount,
};
