import getExpeditiousCache from 'express-expeditious';

const optionsCache = {
	namespace: 'expresscache',
	defaultTtl: '2 minute',
	statusCodeExpires: {
		404: '5 minutes',
		500: 0, // 1 minute in milliseconds
	},
};

const cacheInit = getExpeditiousCache(optionsCache);

module.exports = { cacheInit };
