import { Op } from 'sequelize';
import { User, Profile } from '../models/index.js';
import { decrypt } from '../utils/handleBcrypt.js';
import deleteFile from '../utils/deleteFile.js';
import resizeImage from '../utils/resizeImage.js';

/**
 * Return user
 *
 * @param {*} id
 * @returns
 */

const getUserById = async id => {
	try {
		//find user
		const user = await User.findByPk(id, {
			attributes: ['id', 'name', 'email', 'status', 'is2fa'],
			include: [
				{
					association: 'profile',
					attributes: ['first_name', 'last_name', 'biography', 'avatar'],
				},
			],
		});

		if (!user) {
			throw {
				status: 404,
				message: 'USER_NOT_FOUND',
			};
		}

		return user;
	} catch (e) {
		throw e;
	}
};
/**
 * Update name,email
 *
 * @param {*} id
 * @param {*} body
 * @returns
 */
const accountUpdate = async (id, { currentPassword, email, name }) => {
	try {
		// Verifica que el e-mail a actulizar no este asignado a otro usuario
		// Esto con el fin de evitar un error 409
		const checkEmail = await User.count({
			where: { email, id: { [Op.ne]: id } },
		});
		if (checkEmail) {
			throw {
				status: 400,
				message: 'INVALID_EMAIL',
			};
		}

		//Find user
		const user = await User.findByPk(id);
		if (!user) {
			throw {
				status: 404,
				message: 'USER_NOT_FOUND',
			};
		}

		// Checar contraseña
		if (!(await decrypt(currentPassword, user.password))) {
			throw {
				status: 400,
				message: 'INVALID_PASSWORD',
			};
		}

		// Update
		await user.update({ name, email });

		// Return
		return 'Information updated.';
	} catch (e) {
		throw e;
	}
};

/**
 * Update password
 *
 * @param {*} id
 * @param {*} body
 * @returns
 */

const passwordUpdate = async (id, { currentPassword, newPassword }) => {
	try {
		// Buscar usuario
		const user = await User.findByPk(id);
		if (!user) {
			throw {
				status: 404,
				message: 'USER_NOT_FOUND',
			};
		}

		// Checar contraseña
		if (!(await decrypt(currentPassword, user.password))) {
			throw {
				status: 400,
				message: 'INVALID_PASSWORD',
			};
		}

		// Update password
		await user.update({ password: newPassword });

		// Message
		return 'Information updated.';
	} catch (e) {
		throw e;
	}
};

/**
 * Update first_name,last_name,biography
 *
 * @param {*} id
 * @param {*} body
 * @returns
 */
const profileUpdate = async (id, { first_name, last_name, biography }) => {
	try {
		// Buscar profile
		const profile = await Profile.findOne({ where: { user_id: id } });
		if (!profile) {
			throw {
				status: 404,
				message: 'USER_NOT_PROFILE',
			};
		}

		// Update profile
		await profile.update({ first_name, last_name, biography });

		// Messagge
		return 'Information updated.';
	} catch (e) {
		throw e;
	}
};
/**
 * Update photo
 *
 * @param {*} id
 * @param {*} photo
 * @returns
 */

const photoUpdate = async (id, file) => {
	try {
		// Find profile
		const profile = await Profile.findOne({ where: { user_id: id } });
		if (!profile) {
			throw {
				status: 404,
				message: 'USER_NOT_PROFILE',
			};
		}

		// Resize image
		const resizedImage = await resizeImage(file, 128, 128); // name file,width:,height,
		if (!resizeImage) {
			throw {
				status: 500,
				message: 'ERROR_RESIZE_IMAGE',
			};
		}

		// Delete previous image
		if (profile.avatar != 'avatar_default.png') {
			await deleteFile(profile.avatar);
		}

		// Update rofile
		await profile.update({ avatar: resizedImage });

		// Respuesta
		return 'Information updated.';
	} catch (e) {
		throw e;
	}
};

/**
 * Active 2fa
 *
 * @param {*} id
 * @param {*} f2a
 * @returns
 */
const active2Fa = async (id, { is2fa }) => {
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
		await user.update({ is2fa });

		// Enviar respuesta
		return `Two-factor is ${is2fa}`;
	} catch (e) {
		throw e;
	}
};

module.exports = {
	getUserById,
	accountUpdate,
	passwordUpdate,
	profileUpdate,
	photoUpdate,
	active2Fa,
};
