import { comparePass } from '../utils/handleBcrypt.js';
import { signToken, verifyToken } from '../utils/handleJwt.js';
import { User } from '../models/index.js';
import mail from '../config/mail.js';
import mapRole from '../utils/mapRoleAuth.js';

/**
 * Register user
 *
 * @param {*} fullName
 * @param {*} email
 * @param {*} password
 * @returns
 */

const signup = async (firstName, lastName, email, password) => {
	const name = email.split('@')[0];
	try {
		// Verify the existence of the e-mail address
		// Avoid a duplication error.
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

		// Setear los roles
		await user.setRoles(1); // TODO: 👈👈 revisar con cual role relaciona

		// Generar un token
		const token = await signToken(
			{ user: user.id },
			process.env.SECRET_REGISTER_PASSWORD,
			process.env.REGISTER_PASSWORD_EXPIRE,
		);

		// Link
		const link = `${process.env.DOMAIN_PRODUCTION}/confirm/account/${token}`;

		// Enviar email
		await mail({
			from: process.env.NAME_PROJECT,
			to: email,
			subject: 'Request to confirm your email address 📩',
			name,
			link,
			template: 'email_confirm.ejs',
		});

		return 'You have successfully registered, we send a link to check your email address.';
	} catch (e) {
		throw e;
	}
};
/**
 * Sing in
 *
 * @param {*} email
 * @param {*} password
 * @returns
 */
const login = async (email, password) => {
	try {
		// Consultar el usuario por el email
		const user = await User.findOne({
			where: { email },
			attributes: [
				'id',
				'name',
				'email',
				'email_verified_at',
				'status',
				'password',
			],
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

		// Verifica la contraseña
		if (!(await comparePass(password, user.password))) {
			throw {
				status: 400,
				message: 'INVALID_PASSWORD',
			};
		}

		// mapRole return un array ['user','admin','...']
		const roles = await mapRole(user.roles);

		// Generamos el token firmado con el id del usuario y los roles
		const token = await signToken(
			{ user: user.id, roles: roles },
			process.env.SECRET_SESSION,
			process.env.SESSION_EXPIRE,
		);

		// Set password and status to undefined
		user.set({
			password: undefined,
			status: undefined,
			email_verified_at: undefined,
		});

		// return data
		return {
			user,
			token,
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

		// Generamos el token firmado con el id del usuario
		const token = await signToken(
			{ user: user.id },
			process.env.SECRET_SESSION_TWO,
			process.env.SECRET_SESSION_TWO_EXPIRE,
		);

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

		// mapRole return un array ['user','admin','...']
		const roles = await mapRole(user.roles);

		// Generamos el token firmado con el id del usuario y los roles
		const key = await signToken(
			{ user: user.id, roles: roles },
			process.env.SECRET_SESSION,
			process.env.SESSION_EXPIRE,
		);

		// return data
		return {
			user,
			key,
		};
	} catch (e) {
		throw e;
	}
};

/**
 * Confirm account
 *
 * @param {*} token
 * @returns
 */
const confirmAccount = async token => {
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

		// Genera un token
		const token = await signToken(
			{ user: user.id },
			process.env.SECRET_RESET_PASSWORD,
			process.env.RESET_PASSWORD_EXPIRE,
		);
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
	sendAuthEmail,
	verifyAuthEmail,
	confirmAccount,
	forgotPassword,
	resetPassword,
};
