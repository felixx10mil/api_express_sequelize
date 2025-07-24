module.exports = {
	development: {
		username: 'root',
		password: '',
		database: 'api_express_sequelize',
		host: '127.0.0.1',
		port: 3306,
		dialect: 'mysql',
		logging: true, // Set to true if you want to see SQL queries in the console
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: process.env.DB_DIALECT,
		logging: false,
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	},
};
