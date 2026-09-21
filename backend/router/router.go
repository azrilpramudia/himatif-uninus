package router

import (
	"github.com/azrilpramudia/himatif-uninus/internal/handler"
	"github.com/azrilpramudia/himatif-uninus/internal/middleware"
	"github.com/gin-gonic/gin"
)

type Handlers struct {
	Auth 	*handler.AuthHandler
	Event *handler.EventHandler
	Gallery *handler.GalleryHandler
}

func SetupRouter(h *Handlers) *gin.Engine {
	r := gin.Default()
	
	r.Use(middleware.CORSMiddleware())
	
	// Health Check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "Backend is running"})
	})

	// API v1
	v1 := r.Group("/api/v1") 
	{
		// Auth - public
		auth := v1.Group("/auth")
		{
			auth.POST("/login", h.Auth.Login)
			auth.POST("/register", h.Auth.Register)
		}

		// Events - public read
		events := v1.Group("/events")
		{
			events.GET("", h.Event.GetAll)
			events.GET("/:slug", h.Event.GetBySlug)
		}

		// Gallery - public read
		galleries := v1.Group("/galleries")
		{
			galleries.GET("", h.Gallery.GetAll)
			galleries.GET("/:id", h.Gallery.GetByID)
		}

		// Admin - protected routes
		admin := v1.Group("/admin")
		admin.Use(middleware.AuthMiddleware())
		{
			// Event CRUD
			adminEvents := admin.Group("/events")
			{
				adminEvents.GET("", h.Event.GetAll)
				adminEvents.GET("/:id", h.Event.GetByID)
				adminEvents.POST("", h.Event.Create)
				adminEvents.PUT("/:id", h.Event.Update)
				adminEvents.DELETE("/:id", h.Event.Delete)
			}

			// Gallery CRUD
			adminGalleries := admin.Group("/galleries")
			{
				adminGalleries.POST("", h.Gallery.Create)
				adminGalleries.PUT("/:id", h.Gallery.Update)
				adminGalleries.DELETE("/:id", h.Gallery.Delete)
			}

			// Upload endpoint
			admin.POST("/upload", h.Gallery.Upload)
		}
	}

	return r
}