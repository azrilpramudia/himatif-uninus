package domain

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID	uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Name	string	`gorm:"type:varchar(100);not null" json:"name"`
	Email	string	`gorm:"type:varchar(100);uniqueIndex;not null" json:"email"`
	Password	string	`gorm:"type:varchar(255);not null" json:"-"`
	Role	string	`gorm:"type:varchar(20);default:'admin'" json:"role"`
	CreatedAt	time.Time	`gorm:"created_at"`
	UpdatedAt	time.Time	`gorm:"updated_at"`
}