package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/spiritsvault/database"
	"github.com/spiritsvault/models"
	"github.com/spiritsvault/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

// AuthController handles authentication-related requests
type AuthController struct {
	googleOAuthConfig *oauth2.Config
}

// NewAuthController creates a new auth controller with Google OAuth configuration
func NewAuthController() *AuthController {
	// Set up Google OAuth configuration
	googleOAuthConfig := &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}

	return &AuthController{
		googleOAuthConfig: googleOAuthConfig,
	}
}

// Signup handles manual user registration
func (ac *AuthController) Signup(c *gin.Context) {
	var signupReq models.SignupRequest

	// Parse request body
	if err := c.ShouldBindJSON(&signupReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Validate request
	if signupReq.Email == "" && signupReq.PhoneNumber == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Either email or phone number is required"})
		return
	}

	// Check if user already exists
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{}
	if signupReq.Email != "" {
		filter = bson.M{"email": signupReq.Email}
	} else {
		filter = bson.M{"phone_number": signupReq.PhoneNumber}
	}

	var existingUser models.User
	err := database.UsersCollection.FindOne(ctx, filter).Decode(&existingUser)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists with this email or phone number"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(signupReq.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process password"})
		return
	}

	// Create new user
	now := time.Now()
	newUser := models.User{
		ID:           primitive.NewObjectID(),
		Email:        signupReq.Email,
		PhoneNumber:  signupReq.PhoneNumber,
		Name:         signupReq.Name,
		PasswordHash: string(hashedPassword),
		Bio:          signupReq.Bio,
		IsGoogle:     false,
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	// Insert user into database
	_, err = database.UsersCollection.InsertOne(ctx, newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(newUser.ID.Hex())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate access token"})
		return
	}

	// Return success response
	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"token":   token,
		"user": gin.H{
			"id":          newUser.ID.Hex(),
			"email":       newUser.Email,
			"phoneNumber": newUser.PhoneNumber,
			"name":        newUser.Name,
			"bio":         newUser.Bio,
		},
	})
}

// GoogleSignup handles Google OAuth signup
func (ac *AuthController) GoogleSignup(c *gin.Context) {
	var googleReq models.GoogleSignupRequest

	// Parse request body
	if err := c.ShouldBindJSON(&googleReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Verify Google token
	googleUserInfo, err := ac.getGoogleUserInfo(googleReq.GoogleToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Google token"})
		return
	}

	// Check if user already exists with Google ID
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var existingUser models.User
	err = database.UsersCollection.FindOne(ctx, bson.M{"google_id": googleUserInfo["id"]}).Decode(&existingUser)

	var userId string
	if err == nil {
		// User exists, update information
		userId = existingUser.ID.Hex()

		// Update user's information
		update := bson.M{
			"$set": bson.M{
				"name":        googleUserInfo["name"],
				"email":       googleUserInfo["email"],
				"profile_pic": googleUserInfo["picture"],
				"updated_at":  time.Now(),
			},
		}

		_, err = database.UsersCollection.UpdateOne(ctx, bson.M{"_id": existingUser.ID}, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
			return
		}
	} else {
		// Create new user
		now := time.Now()
		newUser := models.User{
			ID:         primitive.NewObjectID(),
			Email:      googleUserInfo["email"].(string),
			Name:       googleUserInfo["name"].(string),
			GoogleID:   googleUserInfo["id"].(string),
			ProfilePic: googleUserInfo["picture"].(string),
			IsGoogle:   true,
			CreatedAt:  now,
			UpdatedAt:  now,
		}

		// Insert user into database
		_, err = database.UsersCollection.InsertOne(ctx, newUser)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}
		userId = newUser.ID.Hex()
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate access token"})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{
		"message": "Google signup successful",
		"token":   token,
	})
}

// getGoogleUserInfo retrieves user information from Google using the provided token
func (ac *AuthController) getGoogleUserInfo(token string) (map[string]interface{}, error) {
	// Create HTTP client
	client := &http.Client{}

	// Make request to Google's userinfo endpoint
	req, err := http.NewRequest("GET", "https://www.googleapis.com/oauth2/v3/userinfo", nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", "Bearer "+token)

	// Execute request
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get user info from Google: %v", resp.Status)
	}

	// Parse response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var userInfo map[string]interface{}
	if err := json.Unmarshal(body, &userInfo); err != nil {
		return nil, err
	}

	return userInfo, nil
}
