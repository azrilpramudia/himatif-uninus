package domain

import (
	"time"

	"github.com/google/uuid"
)

type EventStatus string

const (
	EventStatusUpcoming EventStatus = "upcoming"
	EventStatusOngoing EventStatus = "ongoing"
	EventStatusCompleted EventStatus = "completed"
)

type Event struct {
	ID	uuid.UUID	`gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Title	string	`gorm:"type:varchar(200);not null" json:"title"`
	Slug	string	`gorm:"type:varhar(200);uniqueIndex;not null" json:"slug"`
	Description	string	`gorm:"type:text" json:"description"`
	Content	string	`gorm:"type:text" json:"content"`
	Thumbnail	string	`gorm:"type:varchar(500)" json:"thumbnail"`
	Location	string	`gorm:"type:varchar(200)" json:"location"`
	Status	EventStatus	`gorm:"type:varchar(20);default:'upcoming'" json:"status"`
	StartDate	time.Time	`json:"start_date"`
	EndDate	time.Time	`json:"end_date"`
	CreatedAt	time.Time `json:"created_at"`
	UpdateddAt	time.Time `json:"updated_at"`
}