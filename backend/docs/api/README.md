# HIMATIF UNINUS API

REST API for the HIMATIF UNINUS website, the Informatics Engineering Student
Association of Universitas Islam Nusantara. The API is built with Go, Gin,
GORM, PostgreSQL, and JWT authentication.

## Base URL

| Environment | Base URL |
| --- | --- |
| Local development | `http://localhost:3000` |
| Production | Configure this URL for your deployment. No production API hostname is currently configured in this repository. |

All API routes are relative to the base URL. The server also serves uploaded
files under `/uploads/` and interactive documentation at `/docs/swagger.html`.

## Authentication

The login endpoint issues a JWT for an administrator account:

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your-password"
}
```

Use the returned token for protected routes:

```http
Authorization: Bearer <token>
```

Admin routes require a valid JWT signed using `HS256` and the `admin` role.
Tokens are currently valid for 24 hours. Public registration is disabled:
create the first administrator with the seed command, then use the protected
`POST /api/v1/admin/users` endpoint to add other administrators.

## Endpoints

### Health and authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | Public | Check API availability. |
| `POST` | `/api/v1/auth/login` | Public | Authenticate an administrator and receive a JWT. |
| `POST` | `/api/v1/admin/users` | Admin | Create another administrator. |

### Events

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/v1/events` | Public | List events. |
| `GET` | `/api/v1/events/{slug}` | Public | Get an event by its slug. |
| `GET` | `/api/v1/admin/events` | Admin | List events for administration. |
| `GET` | `/api/v1/admin/events/{id}` | Admin | Get an event by UUID. |
| `POST` | `/api/v1/admin/events` | Admin | Create an event. |
| `PUT` | `/api/v1/admin/events/{id}` | Admin | Update an event. |
| `DELETE` | `/api/v1/admin/events/{id}` | Admin | Delete an event and its related gallery records. |

Event status values are `upcoming`, `ongoing`, and `completed`. Creation
requires `title`, `start_date`, and `end_date`; dates must be RFC 3339
date-time values, and the end date cannot precede the start date.

### Galleries

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/v1/galleries` | Public | List gallery items. |
| `GET` | `/api/v1/galleries?category=kegiatan` | Public | Filter gallery items by category. |
| `GET` | `/api/v1/galleries/{id}` | Public | Get a gallery item by UUID. |
| `GET` | `/api/v1/admin/galleries` | Admin | List gallery items for administration. |
| `GET` | `/api/v1/admin/galleries/{id}` | Admin | Get a gallery item by UUID. |
| `POST` | `/api/v1/admin/galleries` | Admin | Create a gallery item. |
| `PUT` | `/api/v1/admin/galleries/{id}` | Admin | Update a gallery item. |
| `DELETE` | `/api/v1/admin/galleries/{id}` | Admin | Delete a gallery record. |

Gallery categories are `kegiatan`, `prestasi`, `organisasi`, and `lainnya`.
Creating a gallery item requires `title` and `image_url`. The optional
`event_id` must be a UUID. Deleting a gallery record does not currently delete
its image file.

### Image upload

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/admin/upload` | Admin | Upload a JPG, JPEG, PNG, or WEBP image. |
| `GET` | `/uploads/gallery/{filename}` | Public | Retrieve an uploaded image. |

Send the upload as `multipart/form-data` using the `image` field. The maximum
file size is 5 MiB. The upload endpoint stores files in the `gallery` upload
directory and returns a path such as `/uploads/gallery/<filename>.png`. Use
that returned path as `image_url` or as an event thumbnail.

## Request and response conventions

JSON endpoints accept `Content-Type: application/json`. Successful resource
responses use a `data` property, usually alongside a `message`; errors use an
`error` property.

Example success response:

```json
{
  "message": "event created successfully",
  "data": {
    "id": "d0085599-401d-4a21-aafa-160f0181c484",
    "title": "Informatics Coding Camp",
    "slug": "informatics-coding-camp-abc12345"
  }
}
```

Example error response:

```json
{
  "error": "event not found"
}
```

Common status codes include `200` (success), `201` (created), `400` (invalid
input or operation failed), `401` (missing/invalid credentials), `403`
(insufficient role), `404` (resource not found on read routes), `409` (email
already registered), and `500` (server or configuration error). Some update
and delete handlers currently return `400` when an operation fails, including
when a resource does not exist; see the OpenAPI response definitions.

## Local development

From the repository's `backend` directory:

```bash
cp .env.example .env
```

Set the database credentials and a strong `JWT_SECRET` in `.env`. Start the
PostgreSQL service with Docker Compose:

```bash
docker compose up -d
```

Configure `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`, then create the
first administrator:

```bash
go run ./cmd/admin-seed
```

Start the API:

```bash
go run ./cmd/api
```

The default API port is `3000`. If using the frontend development server,
configure `ALLOWED_ORIGIN=http://localhost:3001` in the backend environment.
`UPLOAD_DIR` defaults to `./uploads`.

The seed command fails if the configured admin email already exists. Do not
use production credentials or a production database for local development.

## Environment variables

| Variable | Purpose | Notes |
| --- | --- | --- |
| `APP_PORT` | API listen port. | Defaults to `3000`. |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSLMODE` | PostgreSQL connection settings. | `docker-compose.yml` maps the container port to `DB_PORT`. |
| `JWT_SECRET` | Secret used to sign and verify JWTs. | Required; use a strong, private value. |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | First admin account for the seed command. | Required only when running `go run ./cmd/admin-seed`. |
| `ALLOWED_ORIGIN` | Allowed browser origin for CORS. | Defaults in code to `http://localhost:5000`; set it to the actual frontend origin, such as `http://localhost:3001`. |
| `UPLOAD_DIR` | Filesystem directory for uploaded images. | Defaults to `./uploads`. |

`JWT_EXPIRED_HOUR` and `MAX_FILE_SIZE` are present in `.env.example` but are
not currently read by the implementation. Token lifetime is fixed at 24 hours
and the upload limit is fixed at 5 MiB.

## Tests

Run all backend tests from the `backend` directory:

```bash
go test ./...
go vet ./...
```

The API integration tests exercise routing, middleware, handlers, services,
and file uploads with in-memory repositories and temporary upload directories.
They do not connect to PostgreSQL or validate GORM queries and migrations.

## Interactive API reference

When the API is running locally, open
[http://localhost:3000/docs/swagger.html](http://localhost:3000/docs/swagger.html).
The OpenAPI definition is in [`openapi.yaml`](./openapi.yaml) and can also be
opened in [Swagger Editor](https://editor.swagger.io).
