package integration

import (
	"encoding/json"
	"net/http"
	"testing"
)

func TestAuthAPIIntegration_LoginIssuesUsableAdminToken(t *testing.T) {
	fixture := newIntegrationFixture(t)

	invalid := performRequest(fixture.api, http.MethodPost, "/api/v1/auth/login",
		`{"email":"admin@example.invalid","password":"wrong-password"}`, "")
	if invalid.Code != http.StatusUnauthorized {
		t.Fatalf("invalid login status = %d, want %d", invalid.Code, http.StatusUnauthorized)
	}

	login := performRequest(fixture.api, http.MethodPost, "/api/v1/auth/login",
		`{"email":"admin@example.invalid","password":"integration-password"}`, "")
	if login.Code != http.StatusOK {
		t.Fatalf("login status = %d, want %d; body: %s", login.Code, http.StatusOK, login.Body.String())
	}
	var loginResponse struct {
		Token string `json:"token"`
	}
	if err := json.Unmarshal(login.Body.Bytes(), &loginResponse); err != nil {
		t.Fatalf("decode login response: %v", err)
	}
	if loginResponse.Token == "" {
		t.Fatal("login response returned an empty token")
	}

	created := performRequest(fixture.api, http.MethodPost, "/api/v1/admin/events",
		`{"title":"Authenticated Event","start_date":"2026-10-15T09:00:00Z","end_date":"2026-10-15T12:00:00Z"}`,
		loginResponse.Token)
	if created.Code != http.StatusCreated {
		t.Fatalf("request with login token status = %d, want %d; body: %s", created.Code, http.StatusCreated, created.Body.String())
	}
}
