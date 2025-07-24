'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			email: {
				allowNull: false,
				unique: true,
				type: Sequelize.STRING,
			},
			email_verified_at: { allowNull: true, type: Sequelize.DATE },
			password: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			status: {
				type: Sequelize.ENUM,
				values: ['active', 'inactive'],
				defaultValue: 'inactive',
			},
			is2fa: {
				type: Sequelize.ENUM,
				values: ['active', 'inactive'],
				defaultValue: 'inactive',
			},
			code2fa: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('users');
	},
};
