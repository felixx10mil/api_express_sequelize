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
	controllerAdmin.getUsers,
);
router.get(
	'/roles',
	checkTokenHeader,
	checkRole(['sadmin']),
	controllerAdmin.getRoles,
);
router.get(
	'/roles/by/user/:id',
	validationAdmin.paramsId,
	checkTokenHeader,
	checkRole(['sadmin']),
	controllerAdmin.getRolesByUser,
);
router.patch(
	'/status/user/:id',
	validationAdmin.paramsId,
	validationAdmin.updateStatus,
	checkTokenHeader,
	checkRole(['sadmin']),
	controllerAdmin.updateUserStatus,
);
router.put(
	'/roles/user/:id',
	validationAdmin.paramsId,
	validationAdmin.updateRole,
	checkTokenHeader,
	checkRole(['sadmin']),
	controllerAdmin.updateUserRole,
);
router.delete(
	'/user/:id',
	validationAdmin.paramsId,
	validationAdmin.deleteAccount,
	checkTokenHeader,
	checkRole(['sadmin']),
	controllerAdmin.deleteUser,
);
module.exports = router;
