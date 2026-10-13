package main

import (
	"errors"
	"fmt"
	"log"
	"net/mail"
	"os"
	"strings"

	"github.com/azrilpramudia/himatif-uninus/config"
	domain "github.com/azrilpramudia/himatif-uninus/internal/domain/entity"
	"github.com/azrilpramudia/himatif-uninus/internal/repository"
	"github.com/azrilpramudia/himatif-uninus/internal/service"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	name := strings.TrimSpace(os.Getenv("ADMIN_NAME"))
	email := strings.TrimSpace(os.Getenv("ADMIN_EMAIL"))
	password := os.Getenv("ADMIN_PASSWORD")
	if name == "" || email == "" || password == "" {
		log.Fatal("ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be configured")
	}
	if _, err := mail.ParseAddress(email); err != nil {
		log.Fatal("ADMIN_EMAIL must be a valid email address")
	}
	if len(password) < 6 {
		log.Fatal("ADMIN_PASSWORD must contain at least 6 characters")
	}
	if os.Getenv("JWT_SECRET") == "" {
		log.Fatal("JWT_SECRET must be configured")
	}

	config.ConnectDatabase()
	if err := config.DB.AutoMigrate(&domain.User{}); err != nil {
		log.Fatalf("Failed to migrate user table: %v", err)
	}

	authService := service.NewAuthService(repository.NewUserRepository(config.DB))
	user, err := authService.RegisterAdmin(name, email, password)
	if errors.Is(err, service.ErrEmailAlreadyRegistered) {
		log.Fatalf("An account with ADMIN_EMAIL %q already exists; no changes were made", email)
	}
	if err != nil {
		log.Fatalf("Failed to create admin: %v", err)
	}

	fmt.Printf("Admin account created: %s (%s)\n", user.Name, user.Email)
}
