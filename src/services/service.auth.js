import 'dotenv/config';
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

const signup = async (fullName, email, password) => {
	const name = email.split('@')[0];
	const [first_name, last_name] = fullName.split(' ');
	// Registra el usuario
	const user = await User.create(
		{
			name,
			email,
			email_verified_at: null,
			password,
			status: 'inactive',
			profile: {
				first_name,
				last_name,
				biography: 'write your biography',
				avatar: 'avatar_default.png',
			},
		},
		{
			include: 'profile',
		},
	);
	// Setear los roles
	await user.setRoles(1); //👈👈 // TODO:revisar con cual role relaciona

	// Generar un token
	const token = await signToken(
		{ user: user.id },
		process.env.JWT_REGISTER_TOKEN,
	);

	// Link
	const link = `${process.env.DOMAIN_PRODUCTION}/confirm/account?token=${token}`;

	// Enviar email
	await mail({
		from: 'Request to confirm your email address 🙋‍♂️',
		to: email,
		subject: 'Request to confirm your email address 📩',
		name,
		link,
		template: 'email_confirm.ejs',
	});

	return 'You have successfully registered, please check your email address.';
};
/**
 * Sing in
 *
 * @param {*} email
 * @param {*} password
 * @returns
 */
const signin = async (email, password) => {
	// Consultar el usuario por el email
	const user = await User.findOne({
		where: { email },
		attributes: ['id', 'name', 'email', 'status', 'password'],
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
	if (!(await comparePass(password, user.password))) {
		throw {
			status: 400,
			message: 'INVALID_PASSWORD',
		};
	}

	// Verifica si la cuenta esta activa
	if (user.status !== 'active') {
		throw {
			status: 400,
			message: 'INACTIVE_USER',
		};
	}

	// mapRole return un array ['user','admin','...']
	const roles = await mapRole(user.roles);

	// Generamos el token firmado con el id del usuario y los roles
	const token = await signToken(
		{ user: user.id, roles: roles },
		process.env.JWT_SESSION,
	);

	// Set password and status to undefined
	user.set({ password: undefined, status: undefined });

	// return data
	return {
		user,
		token,
	};
};
/**
 * Confirm account
 *
 * @param {*} token
 * @returns
 */
const confirmAccount = async token => {
	const dataToken = await verifyToken(token);
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
	// Actualiza email_verified_at y el status
	user.set({ email_verified_at: new Date(), status: 'active' });
	await user.save();

	// Enviar respuesta
	return 'Your e-mail address is verified.';
};
/**
 * Forgo password
 *
 * @param {*} email
 * @returns
 */
const forgotPassword = async email => {
	// Busca el usuario
	const user = await User.findOne({
		where: { email },
		attributes: ['id', 'name'],
	});
	if (!user) {
		throw {
			status: 404,
			message: 'USER_NOT_FOUND',
		};
	}

	// Genera un token
	const token = await signToken({ user: user.id }, process.env.JWT_FORGOT_PASS);
	// Generate link
	const link = `${process.env.DOMAIN_PRODUCTION}/reset/password?token=${token}`;

	// Envia un email
	await mail({
		from: 'Request to reset password 🙋‍♂️',
		to: email,
		subject: 'Request to reset password 📩',
		name: user.name,
		link,
		template: 'email_reset_pass.ejs',
	});

	// Enviar respuesta
	return 'Recovery email sent.';
};
/**
 * Reset password
 *
 * @param {*} token
 * @param {*} password
 * @returns
 */
const resetPassword = async (token, password) => {
	// Verifiica el token
	const dataToken = await verifyToken(token);
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
};

module.exports = {
	signup,
	signin,
	confirmAccount,
	forgotPassword,
	resetPassword,
};
