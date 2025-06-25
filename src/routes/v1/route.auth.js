import { Router } from 'express';
// Controller
import controllerAuth from '../../controllers/controller.auth.js';
// Middleware
import validationAuth from '../../validations/validation.auth.js';

const router = Router();

router.post('/signup', validationAuth.signup, controllerAuth.signup);
router.post('/signin', validationAuth.signin, controllerAuth.signin);
router.post('/signinTwo', validationAuth.email, controllerAuth.signinTwo);
router.post(
	'/signinTwoCheck',
	validationAuth.token,
	controllerAuth.signinTwoCheck,
);
router.post(
	'/forgot/password',
	validationAuth.email,
	controllerAuth.forgotPassword,
);
router.post(
	'/confirm/account',
	validationAuth.token,
	controllerAuth.confirmAccount,
);
router.post(
	'/reset/password',
	validationAuth.resetPassword,
	controllerAuth.resetPassword,
);

module.exports = router;
