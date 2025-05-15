import 'dotenv/config';
import app from '../app.js';
import { sequelize } from '../models/index.js';
import logger from '../utils/handleLogger.js';

// PORT
const PORT = process.env.PORT || 3000;

// Setting port
async function main() {
	try {
		// Test the database connection
		await sequelize.authenticate();
		logger.info(
			'Connection to the database has been established successfully.',
		);

		// Express server setup
		app.listen(PORT, () => {
			logger.info(`Server is running on port ${PORT}.`);
		});
	} catch (error) {
		logger.error('Unable to connect to the database 🤷🏼');
	}
}

main();
