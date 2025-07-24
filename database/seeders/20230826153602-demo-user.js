'use strict';

import bCrypt from 'bcryptjs';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'users',
			[
				{
					userName: 'User',
					email: 'admin@example.com',
					password: bCrypt.hashSync('1234567', 10),
					status: 'inactive',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('users', null, {});
		await queryInterface.bulkDelete('Profiles', null, {});
	},
};
