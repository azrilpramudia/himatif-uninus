# Himatif Uninus API Documentation

REST API for the website of the Informatics Engineering Student Association of Universitas Islam Nusantara.

## Tech Stack

- **Language** : Golang
- **Framework** : Gin
- **ORM** : GORM
- **Database** : PostgreSQL (Docker)
- **Auth** : JWT

## Base URL

| Environment | URL                              |
| ----------- | -------------------------------- |
| Development | `http://localhost:3000`          |
| Production  | `https://api.himatif-uninus.org` |

## Authentication

This API uses **JWT Bearer Token** for protected endpoints.

```
Authorization: Bearer <token>
```

Token is obtained after login via `POST /api/v1/auth/login`.

## Endpoints

### Public (No token required)

| Method | Endpoint                              | Description                  |
| ------ | ------------------------------------- | ---------------------------- |
| GET    | `/health`                             | Health check                 |
| POST   | `/api/v1/auth/register`               | Register admin               |
| POST   | `/api/v1/auth/login`                  | Login admin                  |
| GET    | `/api/v1/events`                      | Get all events               |
| GET    | `/api/v1/events/:slug`                | Get event by slug            |
| GET    | `/api/v1/galleries`                   | Get all galleries            |
| GET    | `/api/v1/galleries?category=kegiatan` | Filter galleries by category |
| GET    | `/api/v1/galleries/:id`               | Get gallery by ID            |

### Protected (Bearer Token required)

| Method | Endpoint                      | Description        |
| ------ | ----------------------------- | ------------------ |
| GET    | `/api/v1/admin/events`        | Get all events     |
| GET    | `/api/v1/admin/events/:id`    | Get event by ID    |
| POST   | `/api/v1/admin/events`        | Create new event   |
| PUT    | `/api/v1/admin/events/:id`    | Update event       |
| DELETE | `/api/v1/admin/events/:id`    | Delete event       |
| GET    | `/api/v1/admin/galleries`     | Get all galleries  |
| GET    | `/api/v1/admin/galleries/:id` | Get gallery by ID  |
| POST   | `/api/v1/admin/galleries`     | Create new gallery |
| PUT    | `/api/v1/admin/galleries/:id` | Update gallery     |
| DELETE | `/api/v1/admin/galleries/:id` | Delete gallery     |
| POST   | `/api/v1/admin/upload`        | Upload image       |

## Gallery Categories

| Value        | Description             |
| ------------ | ----------------------- |
| `kegiatan`   | Activity / event photos |
| `prestasi`   | Achievement photos      |
| `organisasi` | Organization photos     |
| `lainnya`    | Others                  |

## Event Status

| Value       | Description       |
| ----------- | ----------------- |
| `upcoming`  | Upcoming event    |
| `ongoing`   | Currently ongoing |
| `completed` | Finished          |

## Response Format

### Success

```json
{
  "message": "success message",
  "data": {}
}
```

### Error

```json
{
  "error": "error message"
}
```

## Error Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 404  | Not Found             |
| 500  | Internal Server Error |

## Development Setup

```bash
# Clone repo
git clone https://github.com/azrilpramudia/himatif-uninus.git
cd himatif-uninus/backend

# Setup environment
cp .env.example .env

# Start database
docker compose up -d

# Run server
air
```

## API Documentation

Interactive API documentation is available via Swagger UI, served directly from the API server.

| Environment | URL                                                |
| ----------- | -------------------------------------------------- |
| Development | `http://localhost:3000/docs/swagger.html`          |
| Production  | `https://api.himatif-uninus.org/docs/swagger.html` |

Alternatively, open `openapi.yaml` in [Swagger Editor](https://editor.swagger.io) for a web-based view.
