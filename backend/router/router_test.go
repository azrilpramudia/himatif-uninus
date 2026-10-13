package router

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	domain "github.com/azrilpramudia/himatif-uninus/internal/domain/entity"
	"github.com/azrilpramudia/himatif-uninus/internal/handler"
	"github.com/azrilpramudia/himatif-uninus/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const routerTestSecret = "router-test-secret"

type authServiceStub struct{}

func (authServiceStub) Login(string, string) (string, error) {
	return "", nil
}

func (authServiceStub) RegisterAdmin(name, email, _ string) (*domain.User, error) {
	return &domain.User{Name: name, Email: email, Role: "admin"}, nil
}

var _ service.AuthService = authServiceStub{}

func TestRegistrationIsNotPublicAndRequiresAdminRole(t *testing.T) {
	gin.SetMode(gin.TestMode)
	t.Setenv("JWT_SECRET", routerTestSecret)

	router := SetupRouter(&Handlers{
		Auth: handler.NewAuthHandler(authServiceStub{}),
	})

	tests := []struct {
		name       string
		path       string
		token      string
		wantStatus int
	}{
		{
			name:       "old public registration route is disabled",
			path:       "/api/v1/auth/register",
			wantStatus: http.StatusNotFound,
		},
		{
			name:       "admin creation requires authentication",
			path:       "/api/v1/admin/users",
			wantStatus: http.StatusUnauthorized,
		},
		{
			name:       "admin creation rejects non-admin users",
			path:       "/api/v1/admin/users",
			token:      routerTestToken(t, "member"),
			wantStatus: http.StatusForbidden,
		},
		{
			name:       "admin can create another admin",
			path:       "/api/v1/admin/users",
			token:      routerTestToken(t, "admin"),
			wantStatus: http.StatusCreated,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			request := httptest.NewRequest(
				http.MethodPost,
				test.path,
				strings.NewReader(`{"name":"New Admin","email":"new@example.invalid","password":"secure-password"}`),
			)
			request.Header.Set("Content-Type", "application/json")
			if test.token != "" {
				request.Header.Set("Authorization", "Bearer "+test.token)
			}
			response := httptest.NewRecorder()
			router.ServeHTTP(response, request)

			if response.Code != test.wantStatus {
				t.Fatalf("status = %d, want %d; body: %s", response.Code, test.wantStatus, response.Body.String())
			}
		})
	}
}

func TestUploadedImagesAreServedFromConfiguredDirectory(t *testing.T) {
	gin.SetMode(gin.TestMode)
	uploadDir := t.TempDir()
	galleryDir := filepath.Join(uploadDir, "gallery")
	if err := os.MkdirAll(galleryDir, 0o755); err != nil {
		t.Fatalf("create gallery directory: %v", err)
	}
	if err := os.WriteFile(filepath.Join(galleryDir, "image.png"), []byte("image"), 0o644); err != nil {
		t.Fatalf("write test image: %v", err)
	}
	t.Setenv("UPLOAD_DIR", uploadDir)

	router := SetupRouter(&Handlers{})
	request := httptest.NewRequest(http.MethodGet, "/uploads/gallery/image.png", nil)
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d; body: %s", response.Code, http.StatusOK, response.Body.String())
	}
	if response.Body.String() != "image" {
		t.Fatalf("body = %q, want %q", response.Body.String(), "image")
	}
}

func routerTestToken(t *testing.T, role string) string {
	t.Helper()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": "test-user",
		"email":   "test@example.invalid",
		"role":    role,
		"exp":     time.Now().Add(time.Hour).Unix(),
	})
	signed, err := token.SignedString([]byte(routerTestSecret))
	if err != nil {
		t.Fatalf("sign test token: %v", err)
	}

	return signed
}
