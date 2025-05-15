'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('profiles', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			first_name: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			last_name: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			biography: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			avatar: {
				allowNull: false,
				type: Sequelize.STRING,
				defaultValue: 'avatar_default.png',
			},
			user_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'users',
					key: 'id',
				},
				onDelete: 'CASCADE',
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
		await queryInterface.dropTable('profiles');
	},
};
