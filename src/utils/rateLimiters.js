import { rateLimit } from 'express-rate-limit';

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minute
	max: 5, // limit each IP to 5 requests per windowMs
	handler: (req, res) => {
		res.status(429).json({
			status: 'FAILED',
			message: 'Too many requests from this IP, please try again after.',
		});
	},
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	validate: { validationsConfig: false },
});

const adminLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minute
	max: 100, // limit each IP to 100 requests per windowMs
	handler: (req, res) => {
		res.status(429).json({
			status: 'FAILED',
			message: 'Too many requests from this IP, please try again after.',
		});
	},
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	validate: { validationsConfig: false },
});

const userLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 100, // limit each IP to 20 requests per windowMs
	handler: (req, res) => {
		res.status(429).json({
			status: 'FAILED',
			message: 'Too many requests from this IP, please try again after.',
		});
	},
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	validate: { validationsConfig: false },
});

module.exports = {
	authLimiter,
	adminLimiter,
	userLimiter,
};
