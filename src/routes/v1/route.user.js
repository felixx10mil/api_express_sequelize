import { Router } from 'express';
// Controller
import controllerUser from '../../controllers/controller.user.js';
// Middleware
import upload from '../../config/multer.js';
import checkTokenHeader from '../../middleware/checkTokenHeader.js';
import checkUserById from '../../middleware/checkUserById.js';
import validationUser from '../../validations/validation.user.js';

const router = Router();

router.get(
	'/:id',
	validationUser.paramsId,
	checkTokenHeader,
	controllerUser.getUserById,
);
router.patch(
	'/account/:id',
	validationUser.paramsId,
	validationUser.updateAccount,
	checkTokenHeader,
	checkUserById,
	controllerUser.accountUpdate,
);
router.patch(
	'/password/:id',
	validationUser.paramsId,
	validationUser.updatePassword,
	checkTokenHeader,
	checkUserById,
	controllerUser.passwordUpdate,
);
router.patch(
	'/profile/:id',
	validationUser.paramsId,
	validationUser.updateProfile,
	checkTokenHeader,
	checkUserById,
	controllerUser.profileUpdate,
);
router.patch(
	'/photo/:id',
	validationUser.paramsId,
	checkTokenHeader,
	checkUserById,
	upload.single('file'),
	controllerUser.photoUpdate,
);

module.exports = router;
