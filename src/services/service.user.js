import { User, Profile } from '../models/index.js';
import { comparePass } from '../utils/handleBcrypt.js';
import deleteFile from '../utils/deleteFile.js';
import resizeImage from '../utils/resizeImage.js';

/**
 * Return user
 *
 * @param {*} id
 * @returns
 */

const getUserById = async id => {
	const user = await User.findByPk(id, {
		attributes: ['id', 'name', 'email', 'status'],
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
};
/**
 * Update name,email
 *
 * @param {*} id
 * @param {*} body
 * @returns
 */
const accountUpdate = async (id, body) => {
	const user = await User.findByPk(id);
	if (!user) {
		throw {
			status: 404,
			message: 'USER_NOT_FOUND',
		};
	}

	// Checar contraseña
	if (!(await comparePass(body.currentPassword, user.password))) {
		throw {
			status: 400,
			message: 'INVALID_PASSWORD',
		};
	}

	// Set user
	user.set({ name: body.name, email: body.email });

	// Update
	await user.save();

	// Return
	return 'Information updated.';
};
/**
 * Update password
 *
 * @param {*} id
 * @param {*} body
 * @returns
 */
const passwordUpdate = async (id, body) => {
	// Buscar usuario
	const user = await User.findByPk(id);
	if (!user) {
		throw {
			status: 404,
			message: 'USER_NOT_FOUND',
		};
	}

	// Checar contraseña
	if (!(await comparePass(body.currentPassword, user.password))) {
		throw {
			status: 400,
			message: 'INVALID_PASSWORD',
		};
	}

	// Update password
	await user.update({ password: body.newPassword });

	// Message
	return 'Information updated.';
};
/**
 * Update first_name,last_name,biography
 *
 * @param {*} id
 * @param {*} body
 * @returns
 */
const profileUpdate = async (id, body) => {
	// Buscar profile
	const profile = await Profile.findOne({ where: { user_id: id } });
	if (!profile) {
		throw {
			status: 404,
			message: 'USER_NOT_PROFILE',
		};
	}

	// Set profile
	profile.set({
		first_name: body.first_name,
		last_name: body.last_name,
		biography: body.biography,
	});

	// Update profile
	await profile.save();

	// Messagge
	return 'Information updated.';
};
/**
 * Update photo
 *
 * @param {*} id
 * @param {*} photo
 * @returns
 */

const photoUpdate = async (id, file) => {
	const profile = await Profile.findOne({ where: { user_id: id } });
	if (!profile) {
		throw {
			status: 404,
			message: 'USER_NOT_PROFILE',
		};
	}

	// Resize image
	// TODO:check
	const resizedImage = await resizeImage(file, 128, 128); // name file,width:,height,
	if (!resizeImage) {
		throw {
			status: 500,
			message: 'ERROR',
		};
	}
	//TODO:end check

	// Delete previous image
	if (profile.avatar != 'avatar_default.png') {
		await deleteFile(profile.avatar);
	}

	// Set profie
	profile.set({ avatar: resizedImage });

	// Update rofile
	profile.save();

	// Respuesta
	return 'Information updated.';
};

module.exports = {
	getUserById,
	accountUpdate,
	passwordUpdate,
	profileUpdate,
	photoUpdate,
};
