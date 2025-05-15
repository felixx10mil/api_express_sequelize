import 'dotenv/config';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import fs from 'fs';

const transporter = nodemailer.createTransport({
	host: process.env.MAILER_HOST,
	port: process.env.MAILER_PORT,
	auth: {
		user: process.env.MAILER_USER,
		pass: process.env.MAILER_PASS,
	},
});

async function mail(data) {
	// Url file
	const url = `${__dirname}/../emailTemplates/${data.template}`;
	// Read file
	const file = fs.readFileSync(url, 'utf-8');
	// Render file
	const html = ejs.render(file, data);

	await transporter.sendMail({
		from: `${data.from} < ${process.env.MAILER_FROM}>`,
		to: data.to,
		subject: data.subject,
		html: html,
	});
}

module.exports = mail;
