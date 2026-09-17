package service

import (
	"errors"
	"os"
	"time"

	domain "github.com/azrilpramudia/himatif-uninus/internal/domain/entity"
	"github.com/azrilpramudia/himatif-uninus/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Login(email, password string) (string, error)
	Register(name, email, password string) (*domain.User, error)
}

type authService struct {
	userRepo repository.UserRepository
}

func NewAuthService(userRepo repository.UserRepository) AuthService {
	return &authService{userRepo}
}

func (s *authService) Login(email, password string) (string, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return "", errors.New("invalid email or password")
	}

	token, err := generateToken(user)
	if err != nil {
		return "", errors.New("failed to generate token")
	}

	return token, nil
}

func (s *authService) Register(name, email, password string) (*domain.User, error) {
	existing, _ := s.userRepo.FindByEmail(email)
	if existing != nil {
		return nil, errors.New("email already registered")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	user := &domain.User{
		Name:	name,
		Email:	email,
		Password: string(hashedPassword),
		Role:	"admin",
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

func generateToken(user *domain.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email": user.Email,
		"role": user.Role,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}