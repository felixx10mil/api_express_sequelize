import randomstring from 'randomstring';
import { decrypt, encrypt } from '../utils/handleBcrypt.js';
import { signToken, verifyToken } from '../utils/handleJwt.js';
import { User } from '../models/index.js';
import mail from '../config/mail.js';
import { mapRole } from '../utils/mapRoleAuth.js';

/**
 * Signup
 *
 * @param {*} firstName
 * @param {*} lastName
 * @param {*} email
 * @param {*} password
 * @returns
 */
const signup = async (firstName, lastName, email, password) => {
	const name = email.split('@')[0];
	try {
		// Consulta un usuario a traves del e-mail
		const checkEmail = await User.findOne({ where: { email } });
		if (checkEmail) {
			throw {
				status: 409,
				message: 'INVALID_EMAIL',
			};
		}

		// Registra el usuario
		const user = await User.create(
			{
				name,
				email,
				email_verified_at: null,
				password,
				status: 'inactive',
				is2fa: 'inactive',
				code2fa: null,
				profile: {
					first_name: firstName,
					last_name: lastName,
					biography: 'write your biography',
					avatar: 'avatar_default.png',
				},
			},
			{
				include: 'profile',
			},
		);

		// Asigna el role 1 al usuario registrado
		await user.setRoles(1); // TODO: 👈👈 revisar con cual role relaciona

		// Generar un token
		const peyload = { user: user.id };
		const secret = process.env.SECRET_REGISTER_PASSWORD;
		const expire_time = '1d';
		const token = await signToken(peyload, secret, expire_time);

		// Link
		const link = `${process.env.DOMAIN_PRODUCTION}/confirm/email/${token}`;

		// Enviar email
		await mail({
			from: process.env.NAME_PROJECT,
			to: email,
			subject: 'Request to confirm your email address 📩',
			name,
			link,
			template: 'email_confirm.ejs',
		});

		return 'A confirmation link was sent to the e-mail.';
	} catch (e) {
		throw e;
	}
};

/**
 * Login
 *
 * @param {*} email
 * @param {*} password
 * @returns
 */
const login = async (email, password) => {
	try {
		// Consulta un usuario a traves del e-mail
		const user = await User.findOne({
			where: { email },
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
			include: [
				{
					association: 'roles',
					attributes: ['name'],
					through: {
						attributes: [],
					},
				},
			],
		});

		// Si user no existe
		if (!user) {
			throw {
				status: 404,
				message: 'USER_NOT_FOUND',
			};
		}

		// Verifica la contraseña
		if (!(await decrypt(password, user.password))) {
			throw {
				status: 400,
				message: 'INVALID_PASSWORD',
			};
		}

		// Checa que el email esta verificado
		if (user.email_verified_at === null || user.email_verified_at === '') {
			throw {
				status: 400,
				message: 'EMAIL_NOT_VERIFIED',
			};
		}

		// Verifica si la cuenta esta activa
		if (!(user.status === 'active')) {
			throw {
				status: 400,
				message: 'INACTIVE_ACCOUNT',
			};
		}

		// Formatea los roles ['user','admin','...']
		const roles = await mapRole(user.roles);

		// Generar un token
		const peyload = { user: user.id, roles: roles };
		const secret = process.env.SECRET_SESSION;
		const expire_time = '1h';
		const token = await signToken(peyload, secret, expire_time);

		// Verify is2FA is active
		if (user.is2fa === 'active') {
			// Generar un token
			const peyload = { user: user.id };
			const secret = process.env.SECRET_SESSION_TWO;
			const expire_time = '1h';
			const token2fa = await signToken(peyload, secret, expire_time);

			// Genera una codigo de 6 digitos aleatorios
			const randomSting = randomstring.generate({
				length: 6,
				charset: ['numeric'],
			});

			// Encriptar codigo generado
			const hash2fa = await encrypt(randomSting);

			// Setea el campo code2fa
			user.update({ code2fa: hash2fa });

			// Envia code2fa por e-mail
			await mail({
				from: process.env.NAME_PROJECT,
				to: user.email,
				subject: 'Verify your identity to proceed with the login',
				name: user.name,
				code: randomSting,
				template: 'two_factor_auth.ejs',
			});

			return {
				user: {
					is2fa: user.is2fa,
				},
				token: token2fa,
				message: 'A code has been sent to your e-mail address.',
			};
		} else {
			// return data
			return {
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					is2fa: user.is2fa,
				},
				token,
				message: 'You are successfully logged in.',
			};
		}
	} catch (e) {
		throw e;
	}
};

/**
 * Verify Two Factor Auth
 *
 * @param {*} token
 * @param {*} code
 * @returns
 */
const verify2fa = async (token, code) => {
	try {
		//Verify token
		const dataToken = await verifyToken(token, process.env.SECRET_SESSION_TWO);
		if (!dataToken) {
			throw {
				status: 401,
				message: 'UNAUTHORIZED',
			};
		}

		// Buscar un usuario
		const user = await User.findByPk(dataToken.user, {
			attributes: ['id', 'name', 'email', 'code2fa'],
			include: [
				{
					association: 'roles',
					attributes: ['name'],
					through: {
						attributes: [],
					},
				},
			],
		});

		// Verify user
		if (!user) {
			throw {
				status: 404,
				message: 'USER_NOT_FOUND',
			};
		}

		// Verify code
		if (!(await decrypt(code, user.code2fa))) {
			throw {
				status: 409,
				message: 'ERROR_CODE_2FA',
			};
		}

		// Formatea los roles ['user','admin','...']
		const roles = await mapRole(user.roles);

		// Generar un token
		const peyload = { user: user.id, roles: roles };
		const secret = process.env.SECRET_SESSION;
		const expire_time = '1h';
		const key = await signToken(peyload, secret, expire_time);

		// return data
		return {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
			key,
		};
	} catch (e) {
		throw e;
	}
};

/**
 * Send auth email
 *
 * @param {*} email
 * @returns
 */
const sendAuthEmail = async email => {
	try {
		// Consultar el usuario por el email
		const user = await User.findOne({
			where: { email },
			attributes: ['id', 'name', 'status', 'email_verified_at'],
		});

		// Si user no existe
		if (!user) {
			throw {
				status: 404,
				message: 'USER_NOT_FOUND',
			};
		}

		// Verifica si la cuenta esta activa
		if (!(user.status === 'active')) {
			throw {
				status: 400,
				message: 'INACTIVE_ACCOUNT',
			};
		}

		// Verifica si el email esta verificado
		if (user.email_verified_at === null || user.email_verified_at === '') {
			throw {
				status: 400,
				message: 'EMAIL_NOT_VERIFIED',
			};
		}

		// Generar un token
		const peyload = { user: user.id };
		const secret = process.env.SECRET_SESSION_TWO;
		const expire_time = '2m';
		const token = await signToken(peyload, secret, expire_time);

		// Generate link
		const link = `${process.env.DOMAIN_PRODUCTION}/verify/auth/email/${token}`;

		// Send email
		await mail({
			from: process.env.NAME_PROJECT,
			to: email,
			subject: 'Solicitud para iniciar sesión 📩',
			name: user.name,
			link,
			template: 'login_by_email.ejs',
		});

		// return data
		return 'We have sent you a verification token';
	} catch (e) {
		throw e;
	}
};

/**
 * Verify auth email
 *
 * @param {*} token
 * @returns
 */
const verifyAuthEmail = async token => {
	try {
		//Verify token
		const dataToken = await verifyToken(token, process.env.SECRET_SESSION_TWO);
		if (!dataToken) {
			throw {
				status: 401,
				message: 'UNAUTHORIZED',
			};
		}
		// Buscar un usuario
		const user = await User.findByPk(dataToken.user, {
			attributes: ['id', 'name', 'email'],
			include: [
				{
					association: 'roles',
					attributes: ['name'],
					through: {
						attributes: [],
					},
				},
			],
		});
		if (!user) {
			throw {
				status: 404,
				message: 'USER_NOT_FOUND',
			};
		}

		// Formatea los roles ['user','admin','...']
		const roles = await mapRole(user.roles);

		// Generar un token
		const peyload = { user: user.id, roles: roles };
		const secret = process.env.SECRET_SESSION;
		const expire_time = '1h';
		const key = await signToken(peyload, secret, expire_time);

		// return data
		return {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
			key,
		};
	} catch (e) {
		throw e;
	}
};

/**
 * Confirm email
 *
 * @param {*} token
 * @returns
 */
const confirmEmail = async token => {
	try {
		//Verify token
		const dataToken = await verifyToken(
			token,
			process.env.SECRET_REGISTER_PASSWORD,
		);

		if (!dataToken) {
			throw {
				status: 401,
				message: 'UNAUTHORIZED',
			};
		}
		// Buscar un usuario
		const user = await User.findByPk(dataToken.user);
		if (!user) {
			throw {
				status: 404,
				message: 'USER_NOT_FOUND',
			};
		}
		// Actualiza email_verified_at
		user.set({ email_verified_at: new Date() });
		await user.save();

		// Enviar respuesta
		return 'Your e-mail address is verified.';
	} catch (e) {
		throw e;
	}
};

/**
 * Forgo password
 *
 * @param {*} email
 * @returns
 */
const forgotPassword = async email => {
	try {
		// Busca el usuario
		const user = await User.findOne({
			where: { email },
			attributes: ['id', 'name', 'status', 'email_verified_at'],
		});

		// Si user no existe
		if (!user) {
			throw {
				status: 404,
				message: 'USER_NOT_FOUND',
			};
		}

		// Verifica si la cuenta esta activa
		if (!(user.status === 'active')) {
			throw {
				status: 400,
				message: 'INACTIVE_ACCOUNT',
			};
		}

		// Verifica si el email esta verificado
		if (user.email_verified_at === null || user.email_verified_at === '') {
			throw {
				status: 400,
				message: 'EMAIL_NOT_VERIFIED',
			};
		}

		// Generar un token
		const peyload = { user: user.id };
		const secret = process.env.SECRET_RESET_PASSWORD;
		const expire_time = '15m';
		const token = await signToken(peyload, secret, expire_time);

		// Generate link
		const link = `${process.env.DOMAIN_PRODUCTION}/reset/password/${token}`;

		// Envia un email
		await mail({
			from: process.env.NAME_PROJECT,
			to: email,
			subject: 'Request to reset password 📩',
			name: user.name,
			link,
			template: 'email_reset_pass.ejs',
		});

		// Enviar respuesta
		return 'Recovery email sent.';
	} catch (e) {
		throw e;
	}
};

/**
 * Reset password
 *
 * @param {*} token
 * @param {*} password
 * @returns
 */
const resetPassword = async (token, password) => {
	try {
		// Verifiica el token
		const dataToken = await verifyToken(
			token,
			process.env.SECRET_RESET_PASSWORD,
		);
		if (!dataToken) {
			throw {
				status: 403,
				message: 'UNAUTHORIZED',
			};
		}

		// Busca el usuario
		const user = await User.findByPk(dataToken.user);
		if (!user) {
			throw {
				status: 404,
				message: 'USER_NOT_FOUND',
			};
		}

		// Actualizar contraseña
		await user.update({ password });

		// Enviar respuesta
		return 'Information updated.';
	} catch (error) {
		throw e;
	}
};

module.exports = {
	signup,
	login,
	verify2fa,
	sendAuthEmail,
	verifyAuthEmail,
	confirmEmail,
	forgotPassword,
	resetPassword,
};
