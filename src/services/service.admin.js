import { Op } from 'sequelize';
import { User, Role } from '../models/index.js';
import deleteFile from '../utils/deleteFile.js';
import mapRoleOptions from '../utils/mapRoleOptions.js';

/**
 * Return users
 *
 * @returns
 */
const getAllUsers = async () => {
	// Find users
	const users = await User.findAll({
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
	// Response
	return users;
};
/**
 * Return roles
 *
 * @returns
 */
const getAllRoles = async id => {
	// Find roles all
	const roles = await Role.findAll({
		where: {
			name: { [Op.ne]: 'sadmin' },
		},
		attributes: ['id', 'name'],
	});
	// Find roles by user
	const roleUser = await User.findByPk(id, {
		attributes: [],
		include: [
			{
				association: 'roles',
				where: {
					name: { [Op.ne]: 'sadmin' },
				},
				attributes: ['id'],
				through: {
					attributes: [],
				},
			},
		],
	});

	// Map role option return array [{label:'admin',value:1,disable:true}, ...]
	const roleAll = await mapRoleOptions(roles);

	// return array [1,2,3,...]
	const roleByUser = await roleUser.roles.map(role => role.id);

	// Response
	return {
		roleAll,
		roleByUser,
	};
};

/**
 * Update status
 *
 * @param {*} id
 * @param {*} status
 * @returns
 */
const updateUserStatus = async (id, { status }) => {
	// Buscar usuario
	const user = await User.findByPk(id);
	if (!user) {
		throw {
			status: 404,
			message: 'USER_NOT_FOUND',
		};
	}

	// Update status
	await user.update({ status });

	// Enviar respuesta
	return `Status ${status}`;
};

/**
 * Update status
 *
 * @param {*} id
 * @param {*} roles
 * @returns
 */

const updateUserRole = async (id, { roles }) => {
	// Buscar usuario
	const user = await User.findByPk(id);
	if (!user) {
		throw {
			status: 404,
			message: 'USER_NOT_FOUND',
		};
	}

	// Update role
	await user.setRoles(roles);

	// Enviar respuesta
	return 'Role updated';
};

/**
 * Delete user
 *
 * @param {*} id
 * @param {*} email
 * @returns
 */
const deleteUser = async (id, { email }) => {
	// Buscar usuario
	const user = await User.findByPk(id, {
		include: [
			{
				association: 'profile',
				attributes: { exclude: ['createdAt', 'updatedAt'] },
			},
		],
	});

	if (!user || user.email != email) {
		throw {
			status: 404,
			message: 'USER_NOT_FOUND',
		};
	}

	// Borrar avatar
	const { profile } = user;
	if (!(profile.avatar === 'avatar_default.png' || profile.avatar === null)) {
		await deleteFile(profile.avatar);
	}

	// Borrar usuario
	user.destroy();

	// Enviar respuesta
	return `User ${email} deleted`;
};

module.exports = {
	getAllUsers,
	getAllRoles,
	updateUserStatus,
	updateUserRole,
	deleteUser,
};
