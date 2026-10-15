# HIMATIF UNINUS Frontend

The frontend for the HIMATIF UNINUS website. It provides public pages for the
student association and an authenticated admin dashboard for managing events
and gallery content.

## Features

- Responsive public website with Home, About, Events, Gallery, and Contact pages.
- Event listing, search and status filters, and event detail pages.
- Gallery listing and category filters.
- Admin sign-in and dashboard for event and gallery management.
- Image upload with JPG, PNG, and WEBP validation and a 5 MB client-side limit.
- Theme switching, accessible dialogs, toast notifications, and reduced-motion
  support for animated UI.
- Event highlight cards on the homepage use local demo content so the landing
  page remains populated when the API has no event records.

## Tech Stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19 and [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Framer Motion](https://www.framer.com/motion/) for UI animations
- [React Hook Form](https://react-hook-form.com/) and
  [Zod](https://zod.dev/) for form handling and validation
- [Vitest](https://vitest.dev/) for unit tests
- [Storybook](https://storybook.js.org/) for component development

## Requirements

- Node.js and npm
- The HIMATIF UNINUS backend for live public event/gallery data and admin
  operations. The frontend can still display its local homepage event
  highlights without the backend.

## Getting Started

Run these commands from the `frontend` directory:

```bash
npm ci
cp .env.example .env
```

Set the backend URL in `.env`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3000
```

`NEXT_PUBLIC_API_URL` must be the base URL of the backend, without an API path
suffix. The frontend adds the required API routes itself.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

The backend must be running and reachable at the configured URL for public
event/gallery requests and admin sign-in or management actions. Configure the
backend separately using its own setup instructions.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server on port `3001`. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Start the production server on port `3001`; run `npm run build` first. |
| `npm run lint` | Run ESLint across the frontend. |
| `npm test` | Run unit tests selected by the `unit` Vitest project. |
| `npm run storybook` | Start Storybook on port `6006`. |
| `npm run build-storybook` | Build the static Storybook site. |

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes for backend-backed features | Backend base URL, for example `http://localhost:3000`. Used by public API requests, the admin login route, and the admin API proxy. Also used to configure the allowed remote image host for uploaded images. |

The `NEXT_PUBLIC_` prefix means this value is included in browser-side code.
It must contain only the backend's public base URL—never credentials, API
secrets, or other sensitive values. Set the correct value in the deployment
environment before building the frontend.

## Pages and Routes

| Route | Description |
| --- | --- |
| `/` | Public homepage with association information, programs, activities, FAQ, and event highlights. |
| `/about` | About the association. |
| `/events` | Event listing with search and status filters, loaded from the backend API. |
| `/events/[slug]` | Event details loaded from the backend, or from a matching local homepage demo highlight. |
| `/gallery` | Gallery content loaded from the backend API. |
| `/contact` | Contact information and contact form. |
| `/admin/login` | Admin sign-in page. |
| `/admin/dashboard` | Admin overview. |
| `/admin/dashboard/events` | Admin event management. |
| `/admin/dashboard/gallery` | Admin gallery management. |

## API and Authentication

- Public event and gallery data is requested from the backend under
  `/api/v1/events` and `/api/v1/galleries`.
- Admin sign-in is handled by the Next.js route at `/api/admin/login`. The
  backend token is stored in an `HttpOnly`, `SameSite=Lax` cookie rather than
  browser storage.
- Admin CRUD and upload requests go through `/api/admin/...`. The server-side
  route proxy reads the cookie and forwards the token to the backend.
- The `proxy.ts` route guard redirects unauthenticated dashboard visits to the
  login page. The backend remains responsible for validating the token and
  authorizing admin operations.
- The backend must serve uploaded images under `/uploads/**`. The Next.js image
  configuration permits remote uploaded images only from the host configured
  in `NEXT_PUBLIC_API_URL`.

Homepage event highlights are demo content defined in
`src/constants/eventHighlights.ts`. Matching detail routes use that local
content; other event detail routes use the backend. Clearly identify demo
content in public deployments if it could be mistaken for actual association
events.

## Project Structure

```text
frontend/
├── public/                  # Static images, icons, and other public assets
├── src/
│   ├── app/
│   │   ├── (public)/        # Public pages and event detail route
│   │   ├── admin/           # Admin login and dashboard pages
│   │   └── api/admin/       # Login, logout, and authenticated API proxy
│   ├── components/
│   │   ├── admin/           # Admin forms, upload field, and confirmation dialog
│   │   ├── layout/          # Navbar, footer, and theme provider
│   │   ├── sections/        # Public page sections
│   │   └── ui/              # Shared UI elements
│   ├── constants/           # Navigation, demo content, and shared constants
│   ├── hooks/               # Data-fetching and UI hooks
│   ├── lib/                 # API client, formatting, and animation helpers
│   ├── schemas/              # Zod validation schemas
│   ├── stories/              # Storybook examples
│   └── types/                # Shared TypeScript types
├── .env.example              # Environment variable template
├── next.config.ts            # Next.js and uploaded-image configuration
└── vitest.config.ts          # Vitest unit and Storybook test projects
```

## Testing and Quality Checks

Run unit tests and lint:

```bash
npm test
npm run lint
```

Run the production build to check compilation and TypeScript:

```bash
npm run build
```

The current unit test suite covers the API client's successful responses,
HTTP errors, network failures, and multipart request headers. Admin workflows
that require backend services should also be exercised against a test backend;
do not use production data for manual testing.

## Production Deployment

1. Configure `NEXT_PUBLIC_API_URL` with the publicly reachable backend URL.
2. Ensure the backend allows the frontend origin and serves uploaded files at
   `/uploads/**`.
3. Use HTTPS in production so the admin authentication cookie is marked
   `Secure`.
4. Install dependencies and build:

   ```bash
   npm ci
   npm run build
   ```

5. Start the production server:

   ```bash
   npm run start
   ```

The frontend production server listens on port `3001` by default. Configure
your hosting platform or reverse proxy to route public traffic to that port.

## Troubleshooting

### API requests fail or show a connection error

- Confirm `NEXT_PUBLIC_API_URL` is set to the backend base URL.
- Confirm the backend is running and reachable from the frontend server and
  browser.
- Restart the Next.js development server after changing `.env`.

### Admin login or dashboard requests fail

- Confirm the backend login and admin API endpoints are available.
- Verify that the configured backend URL is correct and that the admin account
  exists in that backend environment.
- If the backend returns `401`, sign in again; the frontend clears an expired
  admin token when the proxy receives that response.

### Uploaded images do not display

- Confirm the backend returns image paths under `/uploads/` and serves those
  paths successfully.
- Confirm the image host and protocol match `NEXT_PUBLIC_API_URL`.
- Restart or rebuild the frontend after changing the backend URL because the
  Next.js image host configuration is derived from that variable.

### Image upload is rejected

- Use a JPG, PNG, or WEBP image no larger than 5 MB.
- The frontend validates the selection for quick feedback; the backend also
  validates uploads and remains authoritative.
