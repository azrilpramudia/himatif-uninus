package helper

import (
	"errors"
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
)

var allowedExtensions = map[string]bool{
	".jpg":  true,
	".jpeg": true,
	".png":  true,
	".webp": true,
}

func UploadImage(file *multipart.FileHeader, subFolder string) (string, error) {
	// Validasi ekstensi
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if !allowedExtensions[ext] {
		return "", errors.New("file type not allowed, use jpg, jpeg, png, or webp")
	}

	// Validasi ukuran — max 5MB
	if file.Size > 5*1024*1024 {
		return "", errors.New("file size exceeds 5MB limit")
	}

	uploadDir := filepath.Join(os.Getenv("UPLOAD_DIR"), subFolder)
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return "", errors.New("failed to create upload directory")
	}

	// Generate nama file unik
	filename := fmt.Sprintf("%d_%s%s",
		time.Now().Unix(),
		uuid.New().String()[:8],
		ext,
	)

	// Path lengkap
	filePath := filepath.Join(uploadDir, filename)

	// Buka file
	src, err := file.Open()
	if err != nil {
		return "", errors.New("failed to open file")
	}
	defer src.Close()

	// Tulis ke disk
	dst, err := os.Create(filePath)
	if err != nil {
		return "", errors.New("failed to save file")
	}
	defer dst.Close()

	buf := make([]byte, 32*1024)
	for {
		n, err := src.Read(buf)
		if n > 0 {
			dst.Write(buf[:n])
		}
		if err != nil {
			break
		}
	}

	// Return URL path yang bisa diakses frontend
	return fmt.Sprintf("/uploads/%s/%s", subFolder, filename), nil
}

func DeleteImage(imageURL string) error {
	// Hapus prefix /uploads/ untuk dapat path relatif
	relativePath := strings.TrimPrefix(imageURL, "/")
	filePath := filepath.Join(".", relativePath)

	if err := os.Remove(filePath); err != nil && !os.IsNotExist(err) {
		return errors.New("failed to delete file")
	}
	return nil
}