import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
import { handleHttpError, handleError404 } from './middleware/handleError.js';

// Routes
import routeHome from './routes/v1/route.home.js';
import routeAuth from './routes/v1/route.auth.js';
import routeUser from './routes/v1/route.user.js';
import routeAdmin from './routes/v1/route.admin.js';

//  App
const app = express();

//  Cors
const whiteList = [
	process.env.DOMAIN_DEVELOPMENT,
	process.env.DOMAIN_PRODUCTION,
];
app.use(
	cors({
		origin: whiteList,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	}),
);

// Helmet
app.use(helmet());

// Middleware
app.use(morgan(process.env.MORGAN));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'storage')));

//  Routes
app.use('/', routeHome);
app.use('/api/v1/auth', routeAuth);
app.use('/api/v1/users', routeUser);
app.use('/api/v1/admin', routeAdmin);

// Error 404
app.use(handleError404);

// Errors
app.use(handleHttpError);

// Export app
module.exports = app;
