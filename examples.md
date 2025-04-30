# SpiritsVault API Usage Examples

## Setup

1. Make sure you have installed all dependencies:
   ```bash
   go mod tidy
   ```

2. Create a `.env` file from the template:
   ```bash
   cp .env.template .env
   ```

3. Run the application:
   ```bash
   go run cmd/api/main.go
   ```

## Manual Signup

### Request

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "phoneNumber": "+1234567890",
    "name": "John Doe",
    "password": "securepassword",
    "bio": "Whiskey enthusiast with a passion for peaty Scotch"
  }'
```

### Response

```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "5f8a4b7e3c1d2e0a1b9c8d7e",
    "email": "user@example.com",
    "phoneNumber": "+1234567890",
    "name": "John Doe",
    "bio": "Whiskey enthusiast with a passion for peaty Scotch"
  }
}
```

## Google Signup

### Request

```bash
curl -X POST http://localhost:8080/api/auth/google-signup \
  -H "Content-Type: application/json" \
  -d '{
    "googleToken": "YOUR_GOOGLE_ID_TOKEN"
  }'
```

### Response

```json
{
  "message": "Google signup successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Obtaining a Google ID Token for Testing

For development and testing purposes, you can get a Google ID token by:

1. Setting up a Google OAuth 2.0 client in the Google Cloud Console
2. Using the Google OAuth Playground (https://developers.google.com/oauthplayground/)
3. Implementing a simple frontend that uses Google Sign-In button and captures the ID token

### Frontend Example (HTML/JavaScript)

```html
<!DOCTYPE html>
<html>
<head>
  <meta name="google-signin-client_id" content="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
  <script src="https://apis.google.com/js/platform.js" async defer></script>
  <script>
    function onSignIn(googleUser) {
      var id_token = googleUser.getAuthResponse().id_token;
      console.log("ID Token: " + id_token);
      
      // Send to your backend
      fetch('http://localhost:8080/api/auth/google-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          googleToken: id_token
        })
      })
      .then(response => response.json())
      .then(data => console.log(data));
    }
  </script>
</head>
<body>
  <div class="g-signin2" data-onsuccess="onSignIn"></div>
</body>
</html>
``` 