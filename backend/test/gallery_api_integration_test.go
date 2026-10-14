package integration

import (
	"encoding/json"
	"net/http"
	"testing"

	domain "github.com/azrilpramudia/himatif-uninus/internal/domain/entity"
	"github.com/google/uuid"
)

func TestGalleryAPIIntegration_AdminCRUDAndPublicRead(t *testing.T) {
	fixture := newIntegrationFixture(t)
	adminToken := integrationToken(t, "admin")

	created := performRequest(fixture.api, http.MethodPost, "/api/v1/admin/galleries",
		`{"title":"Workshop photo","image_url":"/uploads/gallery/workshop.png","category":"kegiatan"}`, adminToken)
	if created.Code != http.StatusCreated {
		t.Fatalf("gallery create status = %d, want %d; body: %s", created.Code, http.StatusCreated, created.Body.String())
	}

	var createResponse struct {
		Data domain.Gallery `json:"data"`
	}
	if err := json.Unmarshal(created.Body.Bytes(), &createResponse); err != nil {
		t.Fatalf("decode gallery create response: %v", err)
	}
	gallery := createResponse.Data
	if gallery.ID == uuid.Nil || gallery.Title != "Workshop photo" || gallery.Category != domain.CategoryKegiatan {
		t.Fatalf("created gallery has unexpected fields: %+v", gallery)
	}

	publicRead := performRequest(fixture.api, http.MethodGet, "/api/v1/galleries/"+gallery.ID.String(), "", "")
	if publicRead.Code != http.StatusOK {
		t.Fatalf("public gallery read status = %d, want %d; body: %s", publicRead.Code, http.StatusOK, publicRead.Body.String())
	}

	updated := performRequest(fixture.api, http.MethodPut, "/api/v1/admin/galleries/"+gallery.ID.String(),
		`{"title":"Updated workshop photo"}`, adminToken)
	if updated.Code != http.StatusOK {
		t.Fatalf("gallery update status = %d, want %d; body: %s", updated.Code, http.StatusOK, updated.Body.String())
	}

	deleted := performRequest(fixture.api, http.MethodDelete, "/api/v1/admin/galleries/"+gallery.ID.String(), "", adminToken)
	if deleted.Code != http.StatusOK {
		t.Fatalf("gallery delete status = %d, want %d; body: %s", deleted.Code, http.StatusOK, deleted.Body.String())
	}
	missing := performRequest(fixture.api, http.MethodGet, "/api/v1/galleries/"+gallery.ID.String(), "", "")
	if missing.Code != http.StatusNotFound {
		t.Fatalf("gallery read after delete status = %d, want %d", missing.Code, http.StatusNotFound)
	}
}
