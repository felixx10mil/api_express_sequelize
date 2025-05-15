import { Router } from 'express';
// Controller
import controllerAuth from '../../controllers/controller.auth.js';
// Middleware
import validationAuth from '../../validations/validation.auth.js';
import createRateLimiter from '../../middleware/createRateLimiter.js';

// Apply rate limiting for specific routes
const rateLimiter = createRateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minute
	max: 3, // 3 requests per minute
});

const router = Router();

router.post('/signup', validationAuth.signup, controllerAuth.signup);
router.post(
	'/signin',
	//rateLimiter,
	validationAuth.signin,
	controllerAuth.signin,
);
router.post(
	'/confirm/account',
	validationAuth.confirmAccount,
	controllerAuth.confirmAccount,
);
router.post(
	'/forgot/password',
	validationAuth.forgotPassword,
	controllerAuth.forgotPassword,
);
router.post(
	'/reset/password',
	validationAuth.resetPassword,
	controllerAuth.resetPassword,
);

module.exports = router;
