module.exports = {
	development: {
		username: 'root',
		password: '',
		database: 'api_express_sequelize',
		host: '127.0.0.1',
		port: 3306,
		dialect: process.env.DB_DIALECT,
		dialectOptions: {
			bigNumberStrings: true,
		},
		seederStorage: 'sequelize',
		seederStorageTableName: 'seeds',
		migrationStorage: 'sequelize',
		migrationStorageTableName: 'migrations',
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: process.env.DB_DIALECT,
		dialectOptions: {
			bigNumberStrings: true,
			// ssl: {
			// 	ca: fs.readFileSync(__dirname + '/mysql-ca-main.crt'),
			// },
		},
	},
};
