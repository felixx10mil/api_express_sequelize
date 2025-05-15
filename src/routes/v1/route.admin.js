import { Router } from 'express';
// Controller
import controllerAdmin from '../../controllers/controller.admin.js';
// Middleware
import checkTokenHeader from '../../middleware/checkTokenHeader.js';
import checkRole from '../../middleware/checkRole.js';
import validationAdmin from '../../validations/validation.admin.js';

const router = Router();

router.get(
	'/users',
	checkTokenHeader,
	checkRole(['sadmin']),
	controllerAdmin.getAllUsers,
);
router.get(
	'/users/roles/:id',
	validationAdmin.paramsId,
	checkTokenHeader,
	checkRole(['sadmin']),
	controllerAdmin.getAllRoles,
);
router.patch(
	'/users/status/:id',
	validationAdmin.paramsId,
	validationAdmin.updateStatus,
	checkTokenHeader,
	checkRole(['sadmin']),
	controllerAdmin.updateUserStatus,
);
router.put(
	'/users/roles/:id',
	validationAdmin.paramsId,
	validationAdmin.updateRole,
	checkTokenHeader,
	checkRole(['sadmin']),
	controllerAdmin.updateUserRole,
);
router.delete(
	'/users/:id',
	validationAdmin.paramsId,
	validationAdmin.deleteAccount,
	checkTokenHeader,
	checkRole(['sadmin']),
	controllerAdmin.deleteUser,
);
module.exports = router;
