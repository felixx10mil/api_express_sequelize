import sharp from 'sharp';
import deleteFile from './deleteFile';
/**
 * Name file
 * @param {*} file
 * @param {*} width
 * @param {*} height
 * @returns
 */

const resizeImage = async (file, width, height) => {
	const ext = file.split('.').pop();
	const newResizedImage = `file-${Date.now()}.${ext}`;

	try {
		// Disabled cache
		sharp.cache(false);

		// Resize file
		await sharp(`${__dirname}/../storage/files/${file}`)
			.resize({ width, height })
			.toFile(`${__dirname}/../storage/files/${newResizedImage}`);

		// Delete file original
		await deleteFile(file);

		// Return resul
		return newResizedImage;
	} catch (e) {
		throw Error('Error while resizing the image');
	}
};

module.exports = resizeImage;
