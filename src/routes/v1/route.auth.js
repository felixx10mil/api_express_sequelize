import { Router } from 'express';
// Controller
import controllerAuth from '../../controllers/controller.auth.js';
// Middleware
import validationAuth from '../../validations/validation.auth.js';

const router = Router();

router.post('/signup', validationAuth.signup, controllerAuth.signup);
router.post('/login', validationAuth.login, controllerAuth.login);
router.post('/verify/2fa', validationAuth.v2fa, controllerAuth.verify2fa);
router.post(
	'/send/authEmail',
	validationAuth.email,
	controllerAuth.sendAuthEmail,
);
router.post(
	'/verify/authEmail',
	validationAuth.token,
	controllerAuth.verifyAuthEmail,
);
router.post(
	'/forgot/password',
	validationAuth.email,
	controllerAuth.forgotPassword,
);
router.post(
	'/confirm/email',
	validationAuth.token,
	controllerAuth.confirmEmail,
);
router.post(
	'/reset/password',
	validationAuth.resetPassword,
	controllerAuth.resetPassword,
);

module.exports = router;
