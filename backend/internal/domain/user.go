package domain

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID	uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Name	string	`gorm:"type:varchar(100);no null" json:"name"`
	Email	string	`gorm:"type:varchar(100);uniqueIndex;not null" json:"email"`
	Password	string	`gorm:"type:varchar(225);not null" json:"-"`
	Role	string `gorm:"type:varchar(20);default:'admin'" json:"role"`
	CreatedAt	time.Time	`json:"created_at"`
	UpdatedAt	time.Time	`json:"updated_at"`
}