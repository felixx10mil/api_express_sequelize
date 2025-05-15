import multer from 'multer';
import path from 'path';

// Config storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const pathStorage = path.resolve(__dirname, '../storage/files');
		cb(null, pathStorage);
	},
	filename: function (req, file, cb) {
		const ext = file.originalname.split('.').pop();
		const filename = `file-${Date.now()}.${ext}`;
		cb(null, filename);
	},
});

// Config file
const whitelist = ['image/jpeg', 'image/jpg'];
const upload = multer({
	storage,
	limits: { fileSize: 1024 * 1024 }, // 1MB
	fileFilter: (req, file, cb) => {
		if (whitelist.includes(file.mimetype)) {
			return cb(null, true);
		}
		cb(new Error('Error in file format.'));
	},
});

module.exports = upload;
