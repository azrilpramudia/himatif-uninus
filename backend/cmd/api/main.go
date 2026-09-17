// cmd/api/main.go
package main

import (
	"log"
	"os"

	"github.com/azrilpramudia/himatif-uninus/config"
	domain "github.com/azrilpramudia/himatif-uninus/internal/domain/entity"
	"github.com/azrilpramudia/himatif-uninus/internal/handler"
	"github.com/azrilpramudia/himatif-uninus/internal/repository"
	"github.com/azrilpramudia/himatif-uninus/internal/service"
	"github.com/azrilpramudia/himatif-uninus/router"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Connect database
	config.ConnectDatabase()

	// Auto migrate
	if err := config.DB.AutoMigrate(
		&domain.User{},
		&domain.Event{},
		&domain.Gallery{},
	); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// ===== Repository Layer =====
	userRepo    := repository.NewUserRepository(config.DB)
	eventRepo   := repository.NewEventRepository(config.DB)
	galleryRepo := repository.NewGalleryRepository(config.DB)

	// ===== Service Layer =====
	authSvc    := service.NewAuthService(userRepo)
	eventSvc   := service.NewEventService(eventRepo)
	gallerySvc := service.NewGalleryService(galleryRepo)

	// ===== Handler Layer =====
	authHandler    := handler.NewAuthHandler(authSvc)
	eventHandler   := handler.NewEventHandler(eventSvc)
	galleryHandler := handler.NewGalleryHandler(gallerySvc)

	// ===== Router =====
	r := router.SetupRouter(&router.Handlers{
		Auth:    authHandler,
		Event:   eventHandler,
		Gallery: galleryHandler,
	})

	// ===== Start Server =====
	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Server running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}