// internal/service/event_service.go
package service

import (
	"errors"
	"strings"
	"time"

	"github.com/azrilpramudia/himatif-uninus/helper"
	domain "github.com/azrilpramudia/himatif-uninus/internal/domain/entity"
	"github.com/azrilpramudia/himatif-uninus/internal/repository"

	"github.com/google/uuid"
)

type EventService interface {
	GetAll() ([]domain.Event, error)
	GetByID(id string) (*domain.Event, error)
	GetBySlug(slug string) (*domain.Event, error)
	Create(input CreateEventInput) (*domain.Event, error)
	Update(id string, input UpdateEventInput) (*domain.Event, error)
	Delete(id string) error
}

type CreateEventInput struct {
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
	Content     string    `json:"content"`
	Thumbnail   string    `json:"thumbnail"`
	Location    string    `json:"location"`
	Status      string    `json:"status"`
	StartDate   time.Time `json:"start_date" binding:"required"`
	EndDate     time.Time `json:"end_date" binding:"required"`
}

type UpdateEventInput struct {
	Title       *string    `json:"title"`
	Description *string    `json:"description"`
	Content     *string    `json:"content"`
	Thumbnail   *string    `json:"thumbnail"`
	Location    *string    `json:"location"`
	Status      *string    `json:"status"`
	StartDate   *time.Time `json:"start_date"`
	EndDate     *time.Time `json:"end_date"`
}

type eventService struct {
	repo        repository.EventRepository
	galleryRepo repository.GalleryRepository
}

func NewEventService(repo repository.EventRepository, galleryRepo repository.GalleryRepository) EventService {
	return &eventService{repo, galleryRepo}
}

func generateSlug(title string) string {
	slug := strings.ToLower(title)
	slug = strings.ReplaceAll(slug, " ", "-")
	return slug + "-" + uuid.New().String()[:8]
}

func (s *eventService) GetAll() ([]domain.Event, error) {
	return s.repo.FindAll()
}

func (s *eventService) GetByID(id string) (*domain.Event, error) {
	return s.repo.FindByID(id)
}

func (s *eventService) GetBySlug(slug string) (*domain.Event, error) {
	return s.repo.FindBySlug(slug)
}

func (s *eventService) Create(input CreateEventInput) (*domain.Event, error) {
	input.Title = strings.TrimSpace(input.Title)
	if input.Title == "" {
		return nil, errors.New("title is required")
	}
	if input.EndDate.Before(input.StartDate) {
		return nil, errors.New("end date cannot be before start date")
	}

	status := domain.EventStatusUpcoming
	if input.Status != "" {
		status = domain.EventStatus(input.Status)
		if !isValidEventStatus(status) {
			return nil, errors.New("invalid event status")
		}
	}

	event := &domain.Event{
		Title:       input.Title,
		Slug:        generateSlug(input.Title),
		Description: input.Description,
		Content:     input.Content,
		Thumbnail:   input.Thumbnail,
		Location:    input.Location,
		Status:      status,
		StartDate:   input.StartDate,
		EndDate:     input.EndDate,
	}

	if err := s.repo.Create(event); err != nil {
		return nil, err
	}
	return event, nil
}

func (s *eventService) Update(id string, input UpdateEventInput) (*domain.Event, error) {
	event, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("event not found")
	}

	if input.Title != nil {
		title := strings.TrimSpace(*input.Title)
		if title == "" {
			return nil, errors.New("title is required")
		}
		if title != event.Title {
			event.Slug = generateSlug(title)
		}
		event.Title = title
	}
	if input.Description != nil {
		event.Description = *input.Description
	}
	if input.Content != nil {
		event.Content = *input.Content
	}
	if input.Thumbnail != nil {
		event.Thumbnail = *input.Thumbnail
	}
	if input.Location != nil {
		event.Location = *input.Location
	}
	if input.Status != nil {
		status := domain.EventStatus(*input.Status)
		if !isValidEventStatus(status) {
			return nil, errors.New("invalid event status")
		}
		event.Status = status
	}
	if input.StartDate != nil {
		event.StartDate = *input.StartDate
	}
	if input.EndDate != nil {
		event.EndDate = *input.EndDate
	}
	if event.EndDate.Before(event.StartDate) {
		return nil, errors.New("end date cannot be before start date")
	}

	if err := s.repo.Update(event); err != nil {
		return nil, err
	}
	return event, nil
}

func isValidEventStatus(status domain.EventStatus) bool {
	return status == domain.EventStatusUpcoming ||
		status == domain.EventStatusOngoing ||
		status == domain.EventStatusCompleted
}

func (s *eventService) Delete(id string) error {
	event, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("event not found")
	}

	galleries, err := s.galleryRepo.FindByEventID(id)
	if err == nil {
		// Hapus file fisik semua gallery
		for _, g := range galleries {
			helper.DeleteImage(g.ImageURL)
		}
	}

	return s.repo.Delete(event.ID.String())
}
