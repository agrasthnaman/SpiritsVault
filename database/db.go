package database

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	// Client is the MongoDB client
	Client *mongo.Client
	// UsersCollection is the collection for user data
	UsersCollection *mongo.Collection
)

// Connect establishes a connection to the MongoDB database
func Connect() error {
	// Get MongoDB URI from environment variables
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		uri = "mongodb://localhost:27017"
	}

	// Set client options
	clientOptions := options.Client().ApplyURI(uri)

	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var err error
	Client, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		return err
	}

	// Ping the database to verify connection
	if err = Client.Ping(ctx, nil); err != nil {
		return err
	}

	log.Println("Connected to MongoDB successfully")

	// Initialize collections
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "spiritsvault"
	}

	UsersCollection = Client.Database(dbName).Collection("users")

	return nil
}
