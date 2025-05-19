import fs from 'fs/promises';

/**
 * Name file
 * @param {*} file
 * @returns
 */

const deleteFile = async file => {
	try {
		const url = `${__dirname}/../storage/files/${file}`;
		await fs.unlink(url);
		return true;
	} catch (e) {
		throw Error('Error deleting file.');
	}
};

module.exports = deleteFile;
