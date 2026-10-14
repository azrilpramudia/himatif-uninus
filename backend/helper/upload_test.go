package helper

import (
	"bytes"
	"mime/multipart"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestUploadImageWritesUploadedContent(t *testing.T) {
	uploadDir := t.TempDir()
	t.Setenv("UPLOAD_DIR", uploadDir)
	file := uploadTestFile(t, "photo.PNG", []byte("image-content"))

	imageURL, err := UploadImage(file, "gallery")
	if err != nil {
		t.Fatalf("UploadImage() error = %v", err)
	}
	if !strings.HasPrefix(imageURL, "/uploads/gallery/") || !strings.HasSuffix(imageURL, ".png") {
		t.Fatalf("UploadImage() URL = %q, want gallery URL ending in .png", imageURL)
	}

	savedFile := filepath.Join(uploadDir, strings.TrimPrefix(imageURL, "/uploads/"))
	content, err := os.ReadFile(savedFile)
	if err != nil {
		t.Fatalf("read uploaded file: %v", err)
	}
	if string(content) != "image-content" {
		t.Fatalf("uploaded content = %q, want %q", content, "image-content")
	}
}

func TestUploadImageRejectsUnsupportedExtensionAndOversizedFiles(t *testing.T) {
	t.Setenv("UPLOAD_DIR", t.TempDir())

	tests := []struct {
		name  string
		file  *multipart.FileHeader
		match string
	}{
		{
			name:  "unsupported extension",
			file:  uploadTestFile(t, "photo.gif", []byte("image")),
			match: "file type not allowed",
		},
		{
			name: "file exceeds size limit",
			file: func() *multipart.FileHeader {
				file := uploadTestFile(t, "photo.jpg", []byte("image"))
				file.Size = 5*1024*1024 + 1
				return file
			}(),
			match: "file size exceeds",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if _, err := UploadImage(test.file, "gallery"); err == nil || !strings.Contains(err.Error(), test.match) {
				t.Fatalf("UploadImage() error = %v, want error containing %q", err, test.match)
			}
		})
	}
}

func TestUploadImageReportsDirectoryCreationFailure(t *testing.T) {
	uploadDir := filepath.Join(t.TempDir(), "not-a-directory")
	if err := os.WriteFile(uploadDir, []byte("file"), 0o600); err != nil {
		t.Fatalf("create blocking file: %v", err)
	}
	t.Setenv("UPLOAD_DIR", uploadDir)

	_, err := UploadImage(uploadTestFile(t, "photo.jpg", []byte("image")), "gallery")
	if err == nil || !strings.Contains(err.Error(), "failed to create upload directory") {
		t.Fatalf("UploadImage() error = %v, want upload-directory error", err)
	}
}

func uploadTestFile(t *testing.T, filename string, content []byte) *multipart.FileHeader {
	t.Helper()

	var body bytes.Buffer
	writer := multipart.NewWriter(&body)
	part, err := writer.CreateFormFile("image", filename)
	if err != nil {
		t.Fatalf("create multipart file: %v", err)
	}
	if _, err := part.Write(content); err != nil {
		t.Fatalf("write multipart file: %v", err)
	}
	if err := writer.Close(); err != nil {
		t.Fatalf("close multipart writer: %v", err)
	}

	request := httptest.NewRequest("POST", "/", &body)
	request.Header.Set("Content-Type", writer.FormDataContentType())
	if err := request.ParseMultipartForm(1 << 20); err != nil {
		t.Fatalf("parse multipart request: %v", err)
	}
	t.Cleanup(func() {
		if request.MultipartForm != nil {
			_ = request.MultipartForm.RemoveAll()
		}
	})

	return request.MultipartForm.File["image"][0]
}
