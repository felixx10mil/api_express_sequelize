/**
 * Page and size
 * @param {*} page
 * @param {*} size
 * @returns
 */
const getPagination = (page, size) => {
	const limit = size ? size : 1;
	const offset = page ? (page - 1) * limit : 0;

	return { limit, offset };
};

/**
 * data, page and limit
 * @param {*} data
 * @param {*} page
 * @param {*} limit
 * @returns
 */

const getPagingData = (data, page, limit) => {
	const { count: totalItems, rows: items } = data;
	const currentPage = page ? page : 1;
	const totalPages = Math.ceil(totalItems / limit);

	return { items, totalItems, totalPages, currentPage };
};

module.exports = {
	getPagination,
	getPagingData,
};
