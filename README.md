# SpiritsVault Backend API

This is a Go backend application with user authentication functionality, supporting both Google OAuth and manual signup methods.

## Features

- User signup with:
  - Email or phone number and password (manual signup)
  - Google OAuth integration
- JWT-based authentication
- MongoDB database storage
- RESTful API design

## API Endpoints

- `POST /api/auth/signup` - Manual user registration with email/phone number
- `POST /api/auth/google-signup` - Sign up or sign in with Google

## Getting Started

### Prerequisites

- Go 1.21 or higher
- MongoDB instance
- Google OAuth credentials (for Google sign-in)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/spiritsvault.git
   cd spiritsvault
   ```

2. Install dependencies
   ```bash
   go mod tidy
   ```

3. Create a `.env` file based on `.env.template`
   ```bash
   cp .env.template .env
   ```

4. Edit `.env` with your settings:
   - Set your MongoDB connection string
   - Add your Google OAuth credentials
   - Choose a secure JWT secret

### Running the Application

```bash
go run cmd/api/main.go
```

The server will start on the port specified in your `.env` file (default: 8080).

## API Usage

### Manual Signup

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "phoneNumber": "+1234567890",
    "name": "John Doe",
    "password": "securepassword",
    "bio": "This is my bio"
  }'
```

Note: Either `email` or `phoneNumber` is required, but not both.

### Google Signup

```bash
curl -X POST http://localhost:8080/api/auth/google-signup \
  -H "Content-Type: application/json" \
  -d '{
    "googleToken": "your-google-id-token"
  }'
```

## License

[MIT License](LICENSE)
