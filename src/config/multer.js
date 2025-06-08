import multer from 'multer';

const mimetype = ['image/jpeg', 'image/jpg'];
const urlStorage = `${__dirname}/../storage/files/`;

// Config storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, urlStorage);
	},
	filename: (req, file, cb) => {
		const extFilename = file.originalname.split('.').pop();
		const filename = `file-${Date.now()}.${extFilename}`;
		cb(null, filename);
	},
});

// Config file
const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		if (mimetype.includes(file.mimetype)) cb(null, true);
		else cb(new Error('Error in file format.'));
	},
	limits: { fileSize: 1024 * 1024 }, // 1MB,
});

module.exports = upload;
