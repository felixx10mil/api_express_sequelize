# api express sequelize

A simple REST API in Node.js

API Endpoints

| Methods | Urls                              | Description     |
| ------- | --------------------------------- | --------------- |
| POST    | api/v1/auth/signin                | Signin          |
| POST    | api/v1/auth/signup                | Signup          |
| POST    | api/v1/auth/forgot/password       | Forgot password |
| POST    | api/v1/auth/reset/password        | Reset password  |
| POST    | api/v1/auth/confirm/account       | Confirm account |
| GET     | api/v1/users                      | Show Users      |
| GET     | api/v1/users/user_id              | Show User       |
| GET     | api/v1/admin/users/roles/user_id  | Show roles      |
| PUT     | api/v1/admin/users/roles/user_id  | Update role     |
| PATCH   | api/v1/users/account/user_id      | Update account  |
| PATCH   | api/v1/users/password/user_id     | Update password |
| PATCH   | api/v1/users/profile/user_id      | Update profile  |
| PATCH   | api/v1/users/photo/user_id        | Update photo    |
| PATCH   | api/v1/admin/users/status/user_id | Update account  |
| DELETE  | api/v1/admin/users/user_id        | Update account  |

## Quick Start

Clone the repo.

```bash
https://github.com/felixx10mil/api_express_sequelize
cd api_express_sequelize
```

Create .env file from .env.example file

Install the dependencies.

```bash
npm install
```

Create data base

```bash
npx sequelize db:migrate
npx sequelize db:seed:all
```

To start the express server, run the following.

```bash
npm run dev
```
