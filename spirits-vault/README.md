# 🥃 SpiritsVault

A social platform for alcohol enthusiasts to share, discover, and showcase their favorite spirits.

## Architecture

This application follows a modular, domain-driven approach with clean architecture principles:

```
src/
├── modules/                # Feature modules grouped by domain
│   ├── users/              # User domain module
│   │   ├── domain/         # Business domain layer
│   │   │   ├── entities/   # Core domain entities
│   │   │   └── value-objects/ # Value objects with validation
│   │   ├── infrastructure/ # Implementation layer
│   │   │   ├── dao/        # Data Access Objects (direct DB access)
│   │   │   ├── repositories/ # Repository implementations
│   │   │   ├── services/   # Business logic services
│   │   │   └── controllers/ # HTTP controllers
│   │   └── interfaces/     # Interface layer
│   │       ├── dto/        # Data Transfer Objects
│   │       └── IUserRepository.ts # Repository interfaces
│   ├── spirits/            # Spirits domain module (similar structure)
│   └── posts/              # Posts domain module (similar structure)
├── shared/                 # Shared utilities and base classes
│   ├── utils/              # Utility functions
│   ├── middleware/         # Application middleware
│   ├── base-classes/       # Base abstract classes
│   └── types/              # Common types and interfaces
├── config/                 # Configuration files
├── server.ts               # Express server setup
└── index.ts                # App entry point
```

### Architectural Layers

1. **Domain Layer**
   - Contains business logic and rules
   - Entities and value objects are the core of the application
   - Independent of other layers and frameworks

2. **Infrastructure Layer**
   - Implementation of interfaces defined in domain layer
   - Contains database access logic, external services, etc.
   - Adapts external concerns to domain layer

3. **Interface Layer**
   - Defines interfaces and contracts
   - Data Transfer Objects (DTOs) for API communication
   - Repository interfaces that domain services depend on

4. **Application Layer (Controllers)**
   - Handles HTTP requests and responses
   - Uses services from domain layer
   - Translates between domain and external formats using DTOs

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
4. Run the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm start` - Run the production server
- `npm run dev` - Run the development server
- `npm run build` - Build the application
- `npm run seed` - Seed the database with sample data
- `npm run setup` - Install dependencies, build, seed and run the application

## Technologies

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication

## Features

- User authentication (signup, login)
- Add spirits to personal collection
- Create posts about spirits
- "Cheers" (upvote) and comment on posts
- Browse spirits database

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a MongoDB Atlas account)

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/spirits-vault.git
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

4. **Seed the database**

This will populate the database with sample spirits, users, and posts:

```bash
npm run seed
```

5. **Start the development server**

```bash
npm run dev
```

6. **Or use the all-in-one setup command**

```bash
npm run setup
```

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login user

## Project Structure

The project follows a Domain-Driven Design approach:

```
src/
├── api/                # API Routes and Controllers
├── config/             # Configuration files
├── domain/             # Domain models, repositories, and services
│   ├── models/         # Database models
│   ├── repositories/   # Data access layer
│   └── services/       # Business logic
├── infrastructure/     # Infrastructure code
│   ├── database/       # Database connection
│   └── middlewares/    # Middleware functions
├── utils/              # Utility functions
└── server.js           # Main application file
```

## License

MIT 