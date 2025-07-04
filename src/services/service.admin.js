import { Op } from 'sequelize';
import { User, Role } from '../models/index.js';
import deleteFile from '../utils/deleteFile.js';
import mapRoleOptions from '../utils/mapRoleOptions.js';

/**
 * Return users
 *
 * @returns
 */
const getUsers = async () => {
	try {
		// Find users
		const users = await User.findAll({
			attributes: {
				exclude: ['password'],
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
	} catch (e) {
		throw e;
	}
};

/**
 * Return roles
 *
 * @returns
 */
const getRoles = async () => {
	try {
		// Find roles
		const data = await Role.findAll({
			where: {
				name: { [Op.ne]: 'sadmin' },
			},
			attributes: ['id', 'name'],
		});

		// Map role option return array [{label:'admin',value:1,disable:true}, ...]
		const roles = await mapRoleOptions(data);

		// Response
		return {
			roles,
		};
	} catch (e) {
		throw e;
	}
};

/**
 * Return roles by user
 *
 * @returns
 */
const getRolesByUser = async id => {
	try {
		// Find roles by user
		const data = await User.findByPk(id, {
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

		// return array [1,2,3,...]
		const roles = await data.roles.map(role => role.id);

		// Response
		return {
			roles,
		};
	} catch (e) {
		throw e;
	}
};

/**
 * Update status
 *
 * @param {*} id
 * @param {*} status
 * @returns
 */
const updateUserStatus = async (id, { status }) => {
	try {
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
	} catch (e) {
		throw e;
	}
};

/**
 * Update roles by user
 *
 * @param {*} id
 * @param {*} roles
 * @returns
 */

const updateUserRole = async (id, { roles }) => {
	try {
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
	} catch (e) {
		throw e;
	}
};

/**
 * Delete user
 *
 * @param {*} id
 * @param {*} email
 * @returns
 */
const deleteUser = async (id, { email }) => {
	try {
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
	} catch (e) {
		throw e;
	}
};

module.exports = {
	getUsers,
	getRoles,
	getRolesByUser,
	updateUserStatus,
	updateUserRole,
	deleteUser,
};
