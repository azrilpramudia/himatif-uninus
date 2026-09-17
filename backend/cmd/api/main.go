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
)

func main() {
	// load .env
	if err := os.godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	config.ConnectDatabase()

	if err := config.DB.AutoMigrate(
		&domain.User{},
		&domain.Event{},
		&domain.Gallery{},
	); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	userRepo := repository.NewUserRepository(config.DB)
	eventRepo := repository.NewEventRepository(config.DB)
	galleryRepo := repository.NewGalleryRepository(config.DB)

	authService := service.NewAuthService(userRepo)
	eventService := service.NewEventService(eventRepo)
	galleryRepo := service.NewGalleryService(galleryRepo)

	authHandler := handler.NewAuthHandler(authService)
	eventHandler := handler.NewEventService(eventService)
	galleryHandler := handler.NewGalleryHandler(galleryService)

	// setup router
	r := router.SetupRouter(&router.Handlers{
		Auth: authHandler,
		Event: eventHandler,
		Gallery: galleryHandler,
	})

	// start server
	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Server running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}