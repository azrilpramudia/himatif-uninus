package integration

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestUploadAPIIntegration_SavesAndServesImage(t *testing.T) {
	uploadDir := t.TempDir()
	t.Setenv("UPLOAD_DIR", uploadDir)
	fixture := newIntegrationFixture(t)

	token := integrationToken(t, "admin")
	imageContent := []byte("integration image data")
	body, contentType := imageUploadRequestBody(t, "sample.png", imageContent)
	request := httptest.NewRequest(http.MethodPost, "/api/v1/admin/upload", body)
	request.Header.Set("Content-Type", contentType)
	request.Header.Set("Authorization", "Bearer "+token)
	response := httptest.NewRecorder()
	fixture.api.ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("upload status = %d, want %d; body: %s", response.Code, http.StatusOK, response.Body.String())
	}

	var uploadResponse struct {
		ImageURL string `json:"image_url"`
	}
	if err := json.Unmarshal(response.Body.Bytes(), &uploadResponse); err != nil {
		t.Fatalf("decode upload response: %v", err)
	}
	if !strings.HasPrefix(uploadResponse.ImageURL, "/uploads/gallery/") {
		t.Fatalf("uploaded image URL = %q, want /uploads/gallery/ prefix", uploadResponse.ImageURL)
	}

	savedPath := filepath.Join(uploadDir, strings.TrimPrefix(uploadResponse.ImageURL, "/uploads/"))
	savedContent, err := os.ReadFile(savedPath)
	if err != nil {
		t.Fatalf("read saved uploaded image: %v", err)
	}
	if !bytes.Equal(savedContent, imageContent) {
		t.Fatalf("saved image content = %q, want %q", savedContent, imageContent)
	}

	served := performRequest(fixture.api, http.MethodGet, uploadResponse.ImageURL, "", "")
	if served.Code != http.StatusOK {
		t.Fatalf("serve uploaded image status = %d, want %d", served.Code, http.StatusOK)
	}
	servedContent, err := io.ReadAll(served.Body)
	if err != nil {
		t.Fatalf("read served image body: %v", err)
	}
	if !bytes.Equal(servedContent, imageContent) {
		t.Fatalf("served image content = %q, want %q", servedContent, imageContent)
	}

	invalidBody, invalidContentType := imageUploadRequestBody(t, "sample.gif", imageContent)
	invalidRequest := httptest.NewRequest(http.MethodPost, "/api/v1/admin/upload", invalidBody)
	invalidRequest.Header.Set("Content-Type", invalidContentType)
	invalidRequest.Header.Set("Authorization", "Bearer "+token)
	invalidResponse := httptest.NewRecorder()
	fixture.api.ServeHTTP(invalidResponse, invalidRequest)
	if invalidResponse.Code != http.StatusBadRequest {
		t.Fatalf("unsupported upload status = %d, want %d; body: %s", invalidResponse.Code, http.StatusBadRequest, invalidResponse.Body.String())
	}
}

func imageUploadRequestBody(t *testing.T, filename string, content []byte) (*bytes.Buffer, string) {
	t.Helper()

	var body bytes.Buffer
	writer := multipart.NewWriter(&body)
	part, err := writer.CreateFormFile("image", filename)
	if err != nil {
		t.Fatalf("create multipart image field: %v", err)
	}
	if _, err := part.Write(content); err != nil {
		t.Fatalf("write multipart image: %v", err)
	}
	if err := writer.Close(); err != nil {
		t.Fatalf("close multipart writer: %v", err)
	}
	return &body, writer.FormDataContentType()
}
