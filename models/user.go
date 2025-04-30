package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// User represents the user model in the database
type User struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Email        string             `bson:"email" json:"email" validate:"required_without=PhoneNumber,email"`
	PhoneNumber  string             `bson:"phone_number" json:"phoneNumber" validate:"required_without=Email,omitempty"`
	Name         string             `bson:"name" json:"name" validate:"required"`
	PasswordHash string             `bson:"password_hash" json:"passwordHash,omitempty"`
	Bio          string             `bson:"bio" json:"bio"`
	ProfilePic   string             `bson:"profile_pic" json:"profilePic"`
	GoogleID     string             `bson:"google_id" json:"googleId,omitempty"`
	IsGoogle     bool               `bson:"is_google" json:"isGoogle"`
	CreatedAt    time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updatedAt"`
}

// SignupRequest represents the request payload for manual signup
type SignupRequest struct {
	Email       string `json:"email" validate:"required_without=PhoneNumber,email"`
	PhoneNumber string `json:"phoneNumber" validate:"required_without=Email,omitempty"`
	Name        string `json:"name" validate:"required"`
	Password    string `json:"password" validate:"required,min=6"`
	Bio         string `json:"bio"`
}

// GoogleSignupRequest represents the request payload for Google signup
type GoogleSignupRequest struct {
	GoogleToken string `json:"googleToken" validate:"required"`
}
