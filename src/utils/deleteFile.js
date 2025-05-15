import fs from 'fs/promises';

/**
 * Delete file
 *
 * @param {*} photo
 * @returns true / error
 */

const deleteFile = async photo => {
	try {
		const url = `${__dirname}/../storage/files/${photo}`;
		await fs.unlink(url);
		return true;
	} catch (e) {
		throw Error('Error deleting file.');
	}
};

module.exports = deleteFile;
