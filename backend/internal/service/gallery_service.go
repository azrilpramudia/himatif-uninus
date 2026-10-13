package service

import (
	"errors"
	"strings"

	"github.com/azrilpramudia/himatif-uninus/helper"
	domain "github.com/azrilpramudia/himatif-uninus/internal/domain/entity"
	"github.com/azrilpramudia/himatif-uninus/internal/repository"
)

type GalleryService interface {
	GetAll() ([]domain.Gallery, error)
	GetByID(id string) (*domain.Gallery, error)
	GetByCategory(category string) ([]domain.Gallery, error)
	Create(input CreateGalleryInput) (*domain.Gallery, error)
	Update(id string, input UpdateGalleryInput) (*domain.Gallery, error)
	Delete(id string) error
}

type CreateGalleryInput struct {
	Title    string `json:"title" binding:"required"`
	ImageURL string `json:"image_url" binding:"required"`
	Category string `json:"category"`
	EventID  string `json:"event_id"`
}

type UpdateGalleryInput struct {
	Title    *string `json:"title"`
	ImageURL *string `json:"image_url"`
	Category *string `json:"category"`
	EventID  *string `json:"event_id"`
}

type galleryService struct {
	repo repository.GalleryRepository
}

func NewGalleryService(repo repository.GalleryRepository) GalleryService {
	return &galleryService{repo}
}

func (s *galleryService) GetAll() ([]domain.Gallery, error) {
	return s.repo.FindAll()
}

func (s *galleryService) GetByID(id string) (*domain.Gallery, error) {
	gallery, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("gallery not found")
	}
	return gallery, nil
}

func (s *galleryService) GetByCategory(category string) ([]domain.Gallery, error) {
	validCategories := map[string]bool{
		"kegiatan":   true,
		"prestasi":   true,
		"organisasi": true,
		"lainnya":    true,
	}
	if !validCategories[category] {
		return nil, errors.New("invalid category")
	}
	return s.repo.FindByCategory(category)
}

func (s *galleryService) Create(input CreateGalleryInput) (*domain.Gallery, error) {
	input.Title = strings.TrimSpace(input.Title)
	input.ImageURL = strings.TrimSpace(input.ImageURL)
	if input.Title == "" || input.ImageURL == "" {
		return nil, errors.New("title and image_url are required")
	}

	category := domain.CategoryLainnya
	if input.Category != "" {
		category = domain.GalleryCategory(input.Category)
		if !isValidGalleryCategory(category) {
			return nil, errors.New("invalid category")
		}
	}

	gallery := &domain.Gallery{
		Title:    input.Title,
		ImageURL: input.ImageURL,
		Category: category,
	}

	if input.EventID != "" {
		eventID, err := helper.ParseUUID(input.EventID)
		if err != nil {
			return nil, errors.New("invalid event_id format")
		}
		gallery.EventID = &eventID
	}

	if err := s.repo.Create(gallery); err != nil {
		return nil, err
	}
	return gallery, nil
}

func (s *galleryService) Update(id string, input UpdateGalleryInput) (*domain.Gallery, error) {
	gallery, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("gallery not found")
	}

	if input.Title != nil {
		title := strings.TrimSpace(*input.Title)
		if title == "" {
			return nil, errors.New("title is required")
		}
		gallery.Title = title
	}
	if input.ImageURL != nil {
		imageURL := strings.TrimSpace(*input.ImageURL)
		if imageURL == "" {
			return nil, errors.New("image_url is required")
		}
		gallery.ImageURL = imageURL
	}
	if input.Category != nil {
		category := domain.GalleryCategory(*input.Category)
		if !isValidGalleryCategory(category) {
			return nil, errors.New("invalid category")
		}
		gallery.Category = category
	}
	if input.EventID != nil {
		if *input.EventID == "" {
			gallery.EventID = nil
		} else {
			eventID, err := helper.ParseUUID(*input.EventID)
			if err != nil {
				return nil, errors.New("invalid event_id format")
			}
			gallery.EventID = &eventID
		}
	}

	if err := s.repo.Update(gallery); err != nil {
		return nil, err
	}
	return gallery, nil
}

func isValidGalleryCategory(category domain.GalleryCategory) bool {
	return category == domain.CategoryKegiatan ||
		category == domain.CategoryPrestasi ||
		category == domain.CategoryOrganisasi ||
		category == domain.CategoryLainnya
}

func (s *galleryService) Delete(id string) error {
	_, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("gallery not found")
	}
	return s.repo.Delete(id)
}
