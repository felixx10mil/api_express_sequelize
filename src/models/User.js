import { Model } from 'sequelize';
import { encryptPass } from '../utils/handleBcrypt';

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// association profile
			User.hasOne(models.Profile, {
				as: 'profile',
				foreignKey: 'user_id',
			});
			// association Role
			User.belongsToMany(models.Role, {
				as: 'roles',
				through: 'user_role',
				foreignKey: 'user_id',
			});
		}
	}
	User.init(
		{
			name: { allowNull: false, type: DataTypes.STRING },
			email: { allowNull: false, unique: true, type: DataTypes.STRING },
			email_verified_at: { allowNull: true, type: DataTypes.DATE },
			password: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			status: {
				allowNull: false,
				type: DataTypes.ENUM,
				values: ['active', 'inactive'],
				defaultValue: 'inactive',
			},
			is2fa: {
				allowNull: false,
				type: DataTypes.ENUM,
				values: ['active', 'inactive'],
				defaultValue: 'inactive',
			},
			code2fa: {
				allowNull: true,
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			modelName: 'User',
			tableName: 'users',
		},
	);
	// Set password before saving
	User.beforeCreate(async model => {
		model.password = await encryptPass(model.password);
	});
	// Set password before upgrading
	User.beforeUpdate(async model => {
		if (model.changed('password')) {
			model.password = await encryptPass(model.password);
		}
	});

	return User;
};
