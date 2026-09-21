package repository

import (
	domain "github.com/azrilpramudia/himatif-uninus/internal/domain/entity"
	"gorm.io/gorm"
)

type EventRepository interface {
	FindAll() ([]domain.Event, error)
	FindByID(id string) (*domain.Event, error)
	FindBySlug(slug string)	(*domain.Event, error)
	Create(event *domain.Event) error
	Update(event *domain.Event) error
	Delete(id string) error
}

type eventRepository struct {
	db *gorm.DB
}

func NewEventRepository(db *gorm.DB) EventRepository {
	return &eventRepository{db}
}

func (r *eventRepository) FindAll() ([]domain.Event, error) {
	var events []domain.Event
	err := r.db.Order("start_date DESC").Find(&events).Error
	return events, err
}

func (r *eventRepository) FindByID(id string) (*domain.Event, error) {
	var event domain.Event
	err := r.db.Where("id = ?", id).First(&event).Error
	if err != nil {
		return nil, err
	}
	return &event, nil
}

func (r *eventRepository) FindBySlug(slug string) (*domain.Event, error) {
	var event domain.Event
	err := r.db.Where("slug = ?", slug).First(&event).Error
	if err != nil {
		return nil, err
	}
	return &event, nil
}

func (r *eventRepository) Create(event *domain.Event) error {
	return r.db.Create(event).Error
}

func (r *eventRepository) Update(event *domain.Event) error {
	return r.db.Save(event).Error
}

func (r *eventRepository) Delete(id string) error {
	if err := r.db.Where("event_id = ?", id).Delete(&domain.Gallery{}).Error; err != nil {
		return err
	}
	return r.db.Where("id = ?", id).Delete(&domain.Event{}).Error
}