import bcrypt from 'bcryptjs';

/**
 * Password text plain
 * @param {*} passwordTextPlain
 * @returns
 */

const encrypt = async passwordTextPlain => {
	return await bcrypt.hash(passwordTextPlain, 10);
};

/**
 * Password text plaint and hash password user
 * @param {*} passwordTextPlain
 * @param {*} hashPassword
 * @returns
 */

const decrypt = async (passwordTextPlain, hashPassword) => {
	return await bcrypt.compare(passwordTextPlain, hashPassword);
};

module.exports = {
	encrypt,
	decrypt,
};
