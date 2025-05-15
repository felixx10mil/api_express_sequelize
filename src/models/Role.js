import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
	class Role extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Role.belongsToMany(models.User, {
				as: 'users',
				through: 'user_role',
				foreignKey: 'role_id',
			});
		}
	}
	Role.init(
		{
			name: {
				allowNull: false,
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			modelName: 'Role',
			tableName: 'roles',
		},
	);
	return Role;
};
