package domain

import (
	"time"

	"github.com/google/uuid"
)

type GalleryCategory string

const (
	CategoryKegiatan	GalleryCategory = "kegiatan"
	CategoryPrestasi	GalleryCategory = "prestasi"
	CategoryOrganisasi	GalleryCategory = "organisasi"
	CategoryLainnya	GalleryCategory = "lainnya"
)

type Gallery struct {
    ID        uuid.UUID       `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
    Title     string          `gorm:"type:varchar(200);not null" json:"title"`
    ImageURL  string          `gorm:"type:varchar(500);not null" json:"image_url"`
    Category  GalleryCategory `gorm:"type:varchar(50);default:'lainnya'" json:"category"`
    EventID   *uuid.UUID      `gorm:"type:uuid" json:"event_id,omitempty"`
    Event     *Event          `gorm:"foreignKey:EventID;constraint:OnDelete:CASCADE" json:"event,omitempty"`
    CreatedAt time.Time       `json:"created_at"`
    UpdatedAt time.Time       `json:"updated_at"`
}