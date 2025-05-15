import rateLimit from 'express-rate-limit';

function createRateLimiter(options) {
	const limiter = rateLimit({
		windowMs: options.windowMs || 15 * 60 * 1000, // 15 minute by default
		max: options.max || 5, // 5 requests per windowMs by default
		handler: (req, res, next) => {
			const err = new Error('Too many requests, please try again later.');
			err.status = 429; // Or any other relevant status code
			next(err); // Pass the error to the error handling middleware
		},
	});

	return limiter;
}

module.exports = createRateLimiter;
