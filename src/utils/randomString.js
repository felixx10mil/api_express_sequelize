/**
 * Generate key
 * @param {*} length
 * @returns
 */
const generateRandomString = async length => {
	try {
		const characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let string = '';
		for (let i = 0; i < length; i++) {
			key += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		return string;
	} catch (e) {
		return null;
	}
};

module.exports = {
	generateRandomString,
};
