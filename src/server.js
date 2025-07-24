import app from './app.js';
import db from './models/index.js';
import logger from './utils/handleLogger.js';

// PORT
const PORT = process.env.PORT || 3000;

// Setting port
async function main() {
	try {
		// Express server runing
		app.listen(PORT, () => {
			logger.info(`Server is running on port ${PORT}.`);
		});
		// Test the database connection
		await db.sequelize.authenticate();
		logger.info(
			'Connection to the database has been established successfully.',
		);
		await db.sequelize.sync({ force: false });
		logger.info('Database & tables created!');
	} catch (error) {
		logger.error('Unable to connect to the database 🤷🏼');
	}
}

main();
