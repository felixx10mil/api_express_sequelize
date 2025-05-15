# api express sequelize

A simple REST API in Node.js

API Endpoints

| Methods | Urls                             | Description     |
| ------- | -------------------------------- | --------------- |
| POST    | api/v1/auth/signin               | Signin          |
| POST    | api/v1/auth/signup               | Signup          |
| POST    | api/v1/auth/forgot/password      | Forgot password |
| POST    | api/v1/auth/reset/password       | Reset password  |
| POST    | api/v1/auth/confirm/account      | Confirm account |
| GET     | api/v1/users                     | Show Users      |
| GET     | api/v1/users/id                  | Show User       |
| GET     | api/v1/admin/users/roles/user_id | Show roles      |
| PUT     | api/v1/admin/users/roles/id      | Update role     |
| PATCH   | api/v1/users/account/id          | Update account  |
| PATCH   | api/v1/users/password/id         | Update password |
| PATCH   | api/v1/users/profile/id          | Update profile  |
| PATCH   | api/v1/users/photo/id            | Update photo    |
| PATCH   | api/v1/admin/users/status/id     | Update account  |
| DELETE  | api/v1/admin/users/id            | Update account  |

## Quick Start

Clone the repo.

```bash
https://github.com/felixx10mil/api_express_sequelize
cd api_express_sequelize
```

Create the .env file.

```bash
DB_URL = http://127.0.0.1:3000/
PORT = 3000
```

Install the dependencies.

```bash
npm install
```

To start the express server, run the following.

```bash
npm run dev
```
