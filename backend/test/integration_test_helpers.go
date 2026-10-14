package integration

import (
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	domain "github.com/azrilpramudia/himatif-uninus/internal/domain/entity"
	"github.com/azrilpramudia/himatif-uninus/internal/handler"
	"github.com/azrilpramudia/himatif-uninus/internal/repository"
	"github.com/azrilpramudia/himatif-uninus/internal/service"
	"github.com/azrilpramudia/himatif-uninus/router"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

const (
	integrationJWTSecret     = "integration-test-secret"
	integrationAdminEmail    = "admin@example.invalid"
	integrationAdminPassword = "integration-password"
)

type integrationFixture struct {
	api         http.Handler
	eventRepo   *memoryEventRepository
	galleryRepo *memoryGalleryRepository
	userRepo    *memoryUserRepository
}

func newIntegrationFixture(t *testing.T) *integrationFixture {
	t.Helper()

	previousGinMode := gin.Mode()
	gin.SetMode(gin.TestMode)
	t.Cleanup(func() { gin.SetMode(previousGinMode) })
	t.Setenv("JWT_SECRET", integrationJWTSecret)

	eventRepo := newMemoryEventRepository()
	galleryRepo := newMemoryGalleryRepository()
	userRepo := newMemoryUserRepository()
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(integrationAdminPassword), bcrypt.MinCost)
	if err != nil {
		t.Fatalf("hash test password: %v", err)
	}
	userRepo.users[integrationAdminEmail] = &domain.User{
		ID:       uuid.New(),
		Name:     "Integration Admin",
		Email:    integrationAdminEmail,
		Password: string(passwordHash),
		Role:     "admin",
	}

	api := router.SetupRouter(&router.Handlers{
		Auth:    handler.NewAuthHandler(service.NewAuthService(userRepo)),
		Event:   handler.NewEventHandler(service.NewEventService(eventRepo, galleryRepo)),
		Gallery: handler.NewGalleryHandler(service.NewGalleryService(galleryRepo)),
	})
	return &integrationFixture{
		api:         api,
		eventRepo:   eventRepo,
		galleryRepo: galleryRepo,
		userRepo:    userRepo,
	}
}

func performRequest(api http.Handler, method, path, body, token string) *httptest.ResponseRecorder {
	request := httptest.NewRequest(method, path, strings.NewReader(body))
	if body != "" {
		request.Header.Set("Content-Type", "application/json")
	}
	if token != "" {
		request.Header.Set("Authorization", "Bearer "+token)
	}
	response := httptest.NewRecorder()
	api.ServeHTTP(response, request)
	return response
}

func integrationToken(t *testing.T, role string) string {
	t.Helper()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": uuid.NewString(),
		"email":   "integration@example.invalid",
		"role":    role,
		"exp":     time.Now().Add(time.Hour).Unix(),
	})
	signed, err := token.SignedString([]byte(integrationJWTSecret))
	if err != nil {
		t.Fatalf("sign integration token: %v", err)
	}
	return signed
}

type memoryEventRepository struct {
	events map[string]domain.Event
}

func newMemoryEventRepository() *memoryEventRepository {
	return &memoryEventRepository{events: make(map[string]domain.Event)}
}

func (r *memoryEventRepository) FindAll() ([]domain.Event, error) {
	events := make([]domain.Event, 0, len(r.events))
	for _, event := range r.events {
		events = append(events, event)
	}
	return events, nil
}

func (r *memoryEventRepository) FindByID(id string) (*domain.Event, error) {
	event, ok := r.events[id]
	if !ok {
		return nil, fmt.Errorf("event %q not found", id)
	}
	return &event, nil
}

func (r *memoryEventRepository) FindBySlug(slug string) (*domain.Event, error) {
	for _, event := range r.events {
		if event.Slug == slug {
			return &event, nil
		}
	}
	return nil, fmt.Errorf("event with slug %q not found", slug)
}

func (r *memoryEventRepository) Create(event *domain.Event) error {
	if event.ID == uuid.Nil {
		event.ID = uuid.New()
	}
	now := time.Now()
	event.CreatedAt = now
	event.UpdatedAt = now
	r.events[event.ID.String()] = *event
	return nil
}

func (r *memoryEventRepository) Update(event *domain.Event) error {
	if _, ok := r.events[event.ID.String()]; !ok {
		return fmt.Errorf("event %q not found", event.ID)
	}
	event.UpdatedAt = time.Now()
	r.events[event.ID.String()] = *event
	return nil
}

func (r *memoryEventRepository) Delete(id string) error {
	if _, ok := r.events[id]; !ok {
		return fmt.Errorf("event %q not found", id)
	}
	delete(r.events, id)
	return nil
}

var _ repository.EventRepository = (*memoryEventRepository)(nil)

type memoryGalleryRepository struct {
	galleries map[string]domain.Gallery
}

func newMemoryGalleryRepository() *memoryGalleryRepository {
	return &memoryGalleryRepository{galleries: make(map[string]domain.Gallery)}
}

func (r *memoryGalleryRepository) FindAll() ([]domain.Gallery, error) {
	galleries := make([]domain.Gallery, 0, len(r.galleries))
	for _, gallery := range r.galleries {
		galleries = append(galleries, gallery)
	}
	return galleries, nil
}

func (r *memoryGalleryRepository) FindByID(id string) (*domain.Gallery, error) {
	gallery, ok := r.galleries[id]
	if !ok {
		return nil, errors.New("gallery not found")
	}
	return &gallery, nil
}

func (r *memoryGalleryRepository) FindByCategory(category string) ([]domain.Gallery, error) {
	galleries := make([]domain.Gallery, 0)
	for _, gallery := range r.galleries {
		if string(gallery.Category) == category {
			galleries = append(galleries, gallery)
		}
	}
	return galleries, nil
}

func (r *memoryGalleryRepository) FindByEventID(eventID string) ([]domain.Gallery, error) {
	galleries := make([]domain.Gallery, 0)
	for _, gallery := range r.galleries {
		if gallery.EventID != nil && gallery.EventID.String() == eventID {
			galleries = append(galleries, gallery)
		}
	}
	return galleries, nil
}

func (r *memoryGalleryRepository) Create(gallery *domain.Gallery) error {
	if gallery.ID == uuid.Nil {
		gallery.ID = uuid.New()
	}
	now := time.Now()
	gallery.CreatedAt = now
	gallery.UpdatedAt = now
	r.galleries[gallery.ID.String()] = *gallery
	return nil
}

func (r *memoryGalleryRepository) Update(gallery *domain.Gallery) error {
	if _, ok := r.galleries[gallery.ID.String()]; !ok {
		return errors.New("gallery not found")
	}
	gallery.UpdatedAt = time.Now()
	r.galleries[gallery.ID.String()] = *gallery
	return nil
}

func (r *memoryGalleryRepository) Delete(id string) error {
	if _, ok := r.galleries[id]; !ok {
		return errors.New("gallery not found")
	}
	delete(r.galleries, id)
	return nil
}

var _ repository.GalleryRepository = (*memoryGalleryRepository)(nil)

type memoryUserRepository struct {
	users map[string]*domain.User
}

func newMemoryUserRepository() *memoryUserRepository {
	return &memoryUserRepository{users: make(map[string]*domain.User)}
}

func (r *memoryUserRepository) FindByEmail(email string) (*domain.User, error) {
	user, ok := r.users[email]
	if !ok {
		return nil, errors.New("user not found")
	}
	return user, nil
}

func (r *memoryUserRepository) Create(user *domain.User) error {
	if _, exists := r.users[user.Email]; exists {
		return service.ErrEmailAlreadyRegistered
	}
	if user.ID == uuid.Nil {
		user.ID = uuid.New()
	}
	r.users[user.Email] = user
	return nil
}

var _ repository.UserRepository = (*memoryUserRepository)(nil)
