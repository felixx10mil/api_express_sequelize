import { Router } from 'express';
// Controller
import controllerPayment from '../../controllers/controller.payment.js';
// Middleware
import upload from '../../config/multer.js';
import checkTokenHeader from '../../middleware/checkTokenHeader.js';

const router = Router();

router.post('/create', checkTokenHeader, controllerPayment.createPayment);

module.exports = router;
