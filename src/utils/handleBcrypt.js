import bcrypt from 'bcryptjs';

/**
 * Password text plain
 * @param {*} passwordPlain
 * @returns
 */

const encryptPass = async passwordPlain => {
	return await bcrypt.hash(passwordPlain, 10);
};

/**
 * Password text plaint and hash password user
 * @param {*} passwordPlain
 * @param {*} hashPassword
 * @returns
 */

const comparePass = async (passwordPlain, hashPassword) => {
	return await bcrypt.compare(passwordPlain, hashPassword);
};

module.exports = {
	encryptPass,
	comparePass,
};
