'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('roles', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.ENUM,
				values: ['admin', 'user'],
				defaultValue: 'user',
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
		await queryInterface.dropTable('roles');
	},
};
