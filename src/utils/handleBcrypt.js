import bcrypt from 'bcryptjs';

/**
 * Encrypt pass
 *
 * @param {*} passwordPlain
 * @returns password emcriptado
 */

const encryptPass = async passwordPlain => {
	const hash = await bcrypt.hash(passwordPlain, 10);
	return hash;
};

/**
 * Compare pass
 * @param {*} passwordPlain
 * @param {*} hashPassword
 * @returns  true /false
 */

const comparePass = async (passwordPlain, hashPassword) => {
	return await bcrypt.compare(passwordPlain, hashPassword);
};

module.exports = {
	encryptPass,
	comparePass,
};
