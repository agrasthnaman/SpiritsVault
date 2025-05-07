# 🥃 SpiritsVault

A social platform for alcohol enthusiasts to share, discover, and showcase their favorite spirits.

### Current Status

The project is in transition from a traditional layered architecture to a modular domain-driven structure. Files are being migrated incrementally to the new structure while maintaining functionality.

### Data Flow

The data flow follows the layered architecture pattern:

API/Controller → Service → Repository → DAO

1. Controllers receive requests and call domain services
2. Services encapsulate business logic and use repositories
3. Repositories implement domain interfaces and use DAOs
4. DAOs handle direct database interactions

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start MongoDB and run the server with a single command:
   ```bash
   npm run start:dev
   ```

Alternatively, you can start services separately:

1. Start MongoDB with Docker:
   ```bash
   docker-compose up -d
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run start` - Run the production server
- `npm run dev` - Run the development server
- `npm run build` - Build the application
- `npm run seed` - Seed the database with sample data
- `npm run setup` - Install dependencies, build, seed and run the application
- `npm run start:dev` - Start MongoDB container and run the development server (recommended for local development)

> **Note:** Always use `npm run script-name` to execute scripts, not just `npm script-name`. For example, use `npm run start:dev` instead of `npm start:dev`.

## Technologies

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Docker for local development

## Features

- User authentication (signup, login)
- Add spirits to personal collection
- Create posts about spirits
- "Cheers" (upvote) and comment on posts
- Browse spirits database

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: MongoDB (Docker container for local development)
- **Authentication**: JWT

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- Git

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/agrasthnaman/spirits-vault.git
cd spirits-vault
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/spirits-vault
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. **Quick Start**

For the fastest way to get up and running with both MongoDB and the server:

```bash
npm run start:dev  # Important: use 'npm run', not just 'npm'
```

Alternatively, you can follow the steps below for a more manual approach:

5. **Set up MongoDB with Docker**

We use Docker to run MongoDB locally for development. This makes the setup process easier and consistent across different development environments.

```bash
docker-compose up -d
```

This command starts a MongoDB container on port 27017.

6. **Start the development server**

```bash
npm run dev
```

7. **Or use the all-in-one setup command** (excluding Docker setup)

```bash
npm run setup
```

## Why Docker for MongoDB?

We chose to use Docker for local MongoDB development instead of a MongoDB Atlas cluster for several reasons:

1. **Development Simplicity**: Docker provides a consistent environment for all developers without the need for an internet connection during development
2. **Zero External Dependencies**: No need to manage cloud credentials or worry about usage limits
3. **Performance**: Local databases are faster for development without network latency
4. **Cost**: Free for development, no cloud hosting costs
5. **Data Privacy**: All data stays on your local machine

For production deployment, you can easily switch to MongoDB Atlas or any other cloud provider by updating the `MONGODB_URI` in your environment variables.

## API Examples

Here are some example curl commands to interact with the API:

### Welcome Route
```bash
curl http://localhost:3000/
```

### Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123", "name": "Test User"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Get User Profile (Authenticated)
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update User Profile (Authenticated)
```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Updated Test User", "bio": "I love spirits!"}'
```

### Get User's Spirit Collection (Authenticated)
```bash
curl -X GET http://localhost:3000/api/users/collection \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## API Endpoints

### Authentication
- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login user

### User Management
- **GET /api/users/profile** - Get user profile
- **PUT /api/users/profile** - Update user profile
- **GET /api/users/collection** - Get user's spirit collection
- **POST /api/users/collection** - Add a spirit to user's collection
- **DELETE /api/users/collection/:spiritId** - Remove a spirit from user's collection

## License

MIT 