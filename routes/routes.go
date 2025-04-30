package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/spiritsvault/controllers"
)

// SetupRoutes configures the API routes
func SetupRoutes(r *gin.Engine) {
	// Create auth controller
	authController := controllers.NewAuthController()

	// API group
	api := r.Group("/api")
	{
		// Auth routes
		auth := api.Group("/auth")
		{
			auth.POST("/signup", authController.Signup)
			auth.POST("/google-signup", authController.GoogleSignup)
		}
	}

	// Health check route
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "healthy",
		})
	})
}
