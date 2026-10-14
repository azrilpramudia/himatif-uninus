package integration

import (
	"encoding/json"
	"net/http"
	"testing"

	domain "github.com/azrilpramudia/himatif-uninus/internal/domain/entity"
	"github.com/google/uuid"
)

func TestEventAPIIntegration_AdminCRUDAndPublicRead(t *testing.T) {
	fixture := newIntegrationFixture(t)
	adminToken := integrationToken(t, "admin")

	unauthorized := performRequest(fixture.api, http.MethodPost, "/api/v1/admin/events",
		`{"title":"Test Event","start_date":"2026-10-15T09:00:00Z","end_date":"2026-10-15T12:00:00Z"}`, "")
	if unauthorized.Code != http.StatusUnauthorized {
		t.Fatalf("unauthorized create status = %d, want %d", unauthorized.Code, http.StatusUnauthorized)
	}

	memberToken := integrationToken(t, "member")
	forbidden := performRequest(fixture.api, http.MethodPost, "/api/v1/admin/events",
		`{"title":"Test Event","start_date":"2026-10-15T09:00:00Z","end_date":"2026-10-15T12:00:00Z"}`, memberToken)
	if forbidden.Code != http.StatusForbidden {
		t.Fatalf("member create status = %d, want %d", forbidden.Code, http.StatusForbidden)
	}

	created := performRequest(fixture.api, http.MethodPost, "/api/v1/admin/events",
		`{"title":" Integration Event ","description":"Short summary","content":"Details","location":"Bandung","start_date":"2026-10-15T09:00:00Z","end_date":"2026-10-15T12:00:00Z"}`, adminToken)
	if created.Code != http.StatusCreated {
		t.Fatalf("create status = %d, want %d; body: %s", created.Code, http.StatusCreated, created.Body.String())
	}

	var createResponse struct {
		Data domain.Event `json:"data"`
	}
	if err := json.Unmarshal(created.Body.Bytes(), &createResponse); err != nil {
		t.Fatalf("decode create response: %v", err)
	}
	event := createResponse.Data
	if event.ID == uuid.Nil || event.Title != "Integration Event" || event.Slug == "" {
		t.Fatalf("created event has unexpected fields: %+v", event)
	}
	if event.Status != domain.EventStatusUpcoming {
		t.Fatalf("created event status = %q, want upcoming", event.Status)
	}

	publicRead := performRequest(fixture.api, http.MethodGet, "/api/v1/events/"+event.Slug, "", "")
	if publicRead.Code != http.StatusOK {
		t.Fatalf("public read status = %d, want %d; body: %s", publicRead.Code, http.StatusOK, publicRead.Body.String())
	}
	var readResponse struct {
		Data domain.Event `json:"data"`
	}
	if err := json.Unmarshal(publicRead.Body.Bytes(), &readResponse); err != nil {
		t.Fatalf("decode public read response: %v", err)
	}
	if readResponse.Data.ID != event.ID || readResponse.Data.Description != "Short summary" {
		t.Fatalf("public event response = %+v, want created event", readResponse.Data)
	}

	updated := performRequest(fixture.api, http.MethodPut, "/api/v1/admin/events/"+event.ID.String(),
		`{"description":"Updated summary","status":"ongoing"}`, adminToken)
	if updated.Code != http.StatusOK {
		t.Fatalf("update status = %d, want %d; body: %s", updated.Code, http.StatusOK, updated.Body.String())
	}

	updatedRead := performRequest(fixture.api, http.MethodGet, "/api/v1/events/"+event.Slug, "", "")
	var updatedResponse struct {
		Data domain.Event `json:"data"`
	}
	if updatedRead.Code != http.StatusOK {
		t.Fatalf("read after update status = %d, want %d", updatedRead.Code, http.StatusOK)
	}
	if err := json.Unmarshal(updatedRead.Body.Bytes(), &updatedResponse); err != nil {
		t.Fatalf("decode updated event: %v", err)
	}
	if updatedResponse.Data.Description != "Updated summary" || updatedResponse.Data.Status != domain.EventStatusOngoing {
		t.Fatalf("updated event = %+v", updatedResponse.Data)
	}

	deleted := performRequest(fixture.api, http.MethodDelete, "/api/v1/admin/events/"+event.ID.String(), "", adminToken)
	if deleted.Code != http.StatusOK {
		t.Fatalf("delete status = %d, want %d; body: %s", deleted.Code, http.StatusOK, deleted.Body.String())
	}
	missing := performRequest(fixture.api, http.MethodGet, "/api/v1/events/"+event.Slug, "", "")
	if missing.Code != http.StatusNotFound {
		t.Fatalf("read after delete status = %d, want %d", missing.Code, http.StatusNotFound)
	}
}
