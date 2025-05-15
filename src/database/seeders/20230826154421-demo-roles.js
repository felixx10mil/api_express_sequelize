'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'Roles',
			[
				{
					id: 1,
					name: 'sadmin',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 2,
					name: 'admin',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 3,
					name: 'user',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		);
		await queryInterface.bulkInsert(
			'user_role',
			[
				{
					user_id: 1,
					role_id: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		);
	},

	async down(queryInterface, Sequelize) {
		queryInterface.bulkDelete('roles', null, {});
		queryInterface.bulkDelete('user_role', null, {});
	},
};
