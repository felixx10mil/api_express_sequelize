/**
 * Roles user
 * @param {*} roles
 * @returns
 */
const mapRoleOptions = async roles => {
	try {
		const response = await roles.map(role => {
			return {
				label: role.name,
				value: role.id,
				disable: role.name === 'sadmin' ? true : false,
			};
		});
		return response;
	} catch (e) {
		return null;
	}
};

module.exports = mapRoleOptions;
