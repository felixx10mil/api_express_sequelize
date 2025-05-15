import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
	class Profile extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Profile.belongsTo(models.User, {
				as: 'user',
				foreignKey: 'user_id',
			});
		}
	}
	Profile.init(
		{
			first_name: { allowNull: true, type: DataTypes.STRING },
			last_name: { allowNull: true, type: DataTypes.STRING },
			biography: { allowNull: true, type: DataTypes.STRING },
			avatar: { allowNull: true, type: DataTypes.STRING },
		},
		{
			sequelize,
			modelName: 'Profile',
			tableName: 'profiles',
		},
	);
	return Profile;
};
