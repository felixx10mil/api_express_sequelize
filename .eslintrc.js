module.exports = {
	env: {
		browser: true,
		commonjs: false,
		es2021: true,
		node: true,
	},
	extends: ['standard', 'eslint-config-prettier'],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {},
};
