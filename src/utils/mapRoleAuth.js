/**
 * Role user
 * @param {*} userRoles
 * @returns
 */
export const mapRole = async userRoles => {
	try {
		const roles = await userRoles.map(role => role.name);
		return roles;
	} catch (e) {
		return null;
	}
};
