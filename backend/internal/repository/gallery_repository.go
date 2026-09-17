package repository

import (
	domain "github.com/azrilpramudia/himatif-uninus/internal/domain/entity"
	"gorm.io/gorm"
)

type GalleryRepository interface {
	FindAll() ([]domain.Gallery, error)
	FindByID(id string) (*domain.Gallery, error)
	FindByCategory(category string) ([]domain.Gallery, error)
	Create(gallery *domain.Gallery) error
	Update(gallery *domain.Gallery) error
	Delete(id string) error
}

type galleryRepository struct {
	db *gorm.DB
}

func NewGalleryRepository(db *gorm.DB) GalleryRepository {
	return &galleryRepository{db}
}

func (r *galleryRepository) FindAll() ([]domain.Gallery, error) {
	var galleries []domain.Gallery
	err := r.db.Preload("Event").Order("created_at DESC").Find(&galleries).Error
	return galleries, err
} 

func (r *galleryRepository) FindByID(id string) (*domain.Gallery, error) {
	var gallery domain.Gallery
	err := r.db.Preload("Event").Where("id = ?", id).First(&gallery).Error
	if err != nil {
		return nil, err
	}
	return &gallery, nil
}

func (r *galleryRepository) FindByCategory(category string) ([]domain.Gallery, error) {
	var galleries []domain.Gallery
	err := r.db.Where("category = ?", category).Order("created_at DESC").Find(&galleries).Error
	return galleries, err
}

func (r *galleryRepository) Create(gallery *domain.Gallery) error {
	return r.db.Create(gallery).Error
}

func (r *galleryRepository) Update(gallery *domain.Gallery) error {
	return r.db.Save(gallery).Error
}

func (r *galleryRepository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&domain.Gallery{}).Error
}

