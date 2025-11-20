# Access Control RFID API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express.js-API-lightgrey)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Introduction

This project is a REST API for physical access control using RFID cards, built with Node.js, Express, Prisma ORM, and PostgreSQL. It allows you to manage users, roles (admin/user), RFID cards, access logs, and JWT authentication. Designed for access control systems in universities, companies, or labs.

## Main Features
- User registration and authentication with roles (admin/user)
- Soft delete for users (`is_active`)
- Association of RFID cards to users
- Access logs (per user and global)
- Endpoint protection by JWT and role
- Automatic admin user seed
- Email notifications for access attempts (Brevo integration)

## Setup and Getting Started

1. **Clone the repository and enter the directory:**
	```sh
	git clone git@github.com:Fernando162021/access-control-rfid-api.git
	cd access-control-rfid-api
	```
2. **Install dependencies:**
	```sh
	npm install
	```
3. **Configure the `.env` file:**
	 - Copy the example and edit your credentials:
		 ```sh
		 cp .env.example .env
		 # Edit DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, BREVO_API_KEY, EMAIL_SENDER_NAME, EMAIL_SENDER, EMAIL_ADMIN
		 ```
	 - **Required environment variables:**
		 - `DATABASE_URL` — PostgreSQL connection string
		 - `JWT_SECRET` — Secret for JWT signing
		 - `JWT_EXPIRES_IN` — JWT expiration (e.g. 8h)
		 - `BREVO_API_KEY` — Brevo (Sendinblue) API key for email notifications
		 - `EMAIL_SENDER_NAME` — Name for email sender
		 - `EMAIL_SENDER` — Verified sender email in Brevo
		 - `EMAIL_ADMIN` — Admin email to receive notifications

4. **Set up and migrate the database:**
	```sh
	npx prisma migrate dev --name init
	npx prisma generate
	```
5. **Create the initial admin user:**
	```sh
	npm run seed
	```
6. **Start the server:**
	```sh
	npm run dev
	# or
	npm start
	```

## Main Endpoints

### Auth
- `POST /auth/login` — Login (returns JWT)
- `POST /auth/register` — Register user (admin only)
- `GET /auth/me` — Authenticated user profile

### Users
- `GET /users/` — List users (admin only)
- `GET /users/:id` — Get user by ID (admin only)
- `DELETE /users/:id` — Soft delete user (admin only)

### RFID & Access
- `POST /access/rfid` — Register access by RFID card
- `GET /access/logs` — Global access logs (admin only)
- `GET /access/logs/:userId` — Access logs by user (admin only)

## TODO

- Implement camera/face recognition access
- Improve API documentation (OpenAPI/Swagger)
- Add Docker support for easy deployment
- Implement logout endpoint
- Add password reset flow
- Add refresh token support
- Token invalidation (blacklist/rotation)

## Deployment

This project is ready for deployment on [Vercel](https://vercel.com/):

- Includes a `vercel.json` file to route all API requests to `server.js`.
- Make sure to set all required environment variables in your Vercel project settings.
- Recommended: Use a managed PostgreSQL database (e.g., Render, Supabase, Neon).

## Questions or Contributions?
Pull requests and issues are welcome.