/**
 * Return array
 *
 * @param {*} userRoles
 * @returns
 */
const mapRole = async userRoles => {
	try {
		const roles = await userRoles.map(role => role.name);
		return roles;
	} catch (e) {
		return null;
	}
};

module.exports = mapRole;
