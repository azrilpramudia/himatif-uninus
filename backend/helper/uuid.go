package helper

import "github.com/google/uuid"

func ParseUUID(id string) (uuid.UUID, error) {
	return uuid.Parse(id)
}