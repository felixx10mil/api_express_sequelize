import { User } from '../models/index.js';
import { getPagination, getPagingData } from '../utils/pagination.js';

// Controller

/**
 * Get all users
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

export const getAllUsersController = async (req, res, next) => {
	const { page = 1, size = 6 } = req.query;
	try {
		const response = await settingService.getAllUsers(
			parseInt(page),
			parseInt(size),
		);
		res.status(200).json({
			status: 'OK',
			data: response,
		});
	} catch (e) {
		return next(createError(e?.status || 500, e?.message || 'ERROR'));
	}
};

// Service

/**
 * Return users
 *
 * @param {*} page
 * @param {*} size
 * @param {*} search
 * @returns
 */
const getAllUsersServices = async (page, size) => {
	// Set limit and offset
	const { limit, offset } = getPagination(page, size);

	// Find users
	const users = await User.findAndCountAll({
		limit,
		offset,
		attributes: {
			exclude: ['password', 'status', 'email_verified_at'],
		},
		include: [
			{
				association: 'profile',
				attributes: ['avatar'],
			},
		],
		order: [['createdAt', 'DESC']],
	});

	// Paginate items
	const data = getPagingData(users, page, limit);

	// Response
	return data;
};
