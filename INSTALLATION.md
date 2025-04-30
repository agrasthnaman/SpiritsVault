# Installation Guide

This guide provides detailed instructions for setting up and running the SpiritsVault backend API.

## Prerequisites

Before you begin, make sure you have the following installed:

- Go 1.21 or higher
- MongoDB (local instance or a cloud-hosted MongoDB URI)
- Git

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/spiritsvault.git
cd spiritsvault
```

### 2. Install Dependencies

Run the following command to download and install all required Go packages:

```bash
go mod tidy
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.template .env
```

Edit the `.env` file with your specific configuration:

```
# Server settings
PORT=8080

# MongoDB settings
MONGODB_URI=mongodb://localhost:27017
DB_NAME=spiritsvault

# JWT settings
JWT_SECRET=your-secret-key-here

# Google OAuth settings
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URL=http://localhost:8080/auth/google/callback
```

> **Note:** For production environments, ensure you use strong, unique values for JWT_SECRET.

### 4. Setting Up Google OAuth (Optional)

If you want to enable Google sign-in:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Create an OAuth 2.0 Client ID
5. Add authorized redirect URIs (e.g., http://localhost:8080/auth/google/callback)
6. Copy the Client ID and Client Secret to your `.env` file

### 5. Running the Application

Start the application with:

```bash
go run cmd/api/main.go
```

The server will run on port 8080 by default (or the port specified in your `.env` file).

## Testing the Installation

To verify your installation is working correctly:

1. Check the server is running by visiting `http://localhost:8080/health` in your browser
2. You should see a response like: `{"status":"healthy"}`

## Troubleshooting

### Common Issues

#### MongoDB Connection Problems
- Ensure MongoDB is running
- Verify the MongoDB URI in your `.env` file
- Check for any network/firewall restrictions

#### Google OAuth Issues
- Confirm your Google Client ID and Client Secret are correct
- Ensure redirect URIs are properly configured in Google Cloud Console
- Check that the required Google APIs are enabled

#### Port Already in Use
If port 8080 is already being used:
```bash
lsof -i :8080   # Find what's using the port
```
Then either stop that process or change the port in your `.env` file.

## Development Environment

For local development, you may want to install:

- Visual Studio Code or GoLand for Go development
- MongoDB Compass for database management
- Postman for API testing

## Next Steps

After installation, refer to:
- `examples.md` for API usage examples
- `README.md` for an overview of the project 