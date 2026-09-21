# Studio Canvas

A polished mini design editor built as a full-stack take-home assignment. It provides a browser-based React Konva editor backed by a validated Express and MongoDB REST API.

## Features

- Add, select, drag, resize, rotate, and delete rectangles, circles, and text.
- Inspect and edit element coordinates, dimensions, rotation, fill, text, and font size.
- Create, save, list, load, update, and delete persistent canvases.
- Input validation on both client and server; friendly API/network error feedback.
- Undo/redo for all element mutations (`Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z`, `Ctrl/Cmd+Y`).
- Keyboard deletion and PNG export without selection controls.
- Responsive editor layout, confirmations for destructive actions, disabled/loading states, and a canvas library modal.

## Tech stack and architecture

The repository is intentionally a small monorepo:

```text
client/                 Next.js 15 / React 19 UI
  app/                  layout, page, CSS
  components/           Editor shell, Konva stage, inspector, library
  hooks/                local editor state + bounded history
  services/             centralized REST client
  types/                shared frontend canvas contracts
server/                 Express REST API
  src/config/           MongoDB connection
  src/models/           Mongoose Canvas schema
  src/validators/       payload validation
  src/controllers/      HTTP orchestration
  src/routes/           canvas routes
  src/middleware/       centralized errors / 404
.env.example            all documented environment values
```

The frontend keeps editor state local via `useCanvasEditor`; Redux is unnecessary for this focused single-page editor. The API service is the only place `fetch` is used. The backend owns validation and persistence and never trusts client data.

## Setup

Prerequisites: Node.js 20+ and a local MongoDB instance or MongoDB Atlas URI.

1. In a terminal at the repository root, install the convenience development runner:

   ```bash
   npm install
   ```

2. In a second terminal, install the API dependencies and configure it. On Windows PowerShell, copy the example file with `Copy-Item server\.env.example server\.env` (or copy `server/.env.example` to `server/.env` in File Explorer):

   ```bash
   cd server
   npm install
   ```

   Set `MONGODB_URI` in `server/.env`. For local MongoDB, the provided default is suitable.

3. In a third terminal, install the web dependencies and configure it. On Windows PowerShell, copy the example file with `Copy-Item client\.env.example client\.env.local` (or copy `client/.env.example` to `client/.env.local` in File Explorer):

   ```bash
   cd client
   npm install
   ```

4. Start both applications from the root (or use their individual `npm run dev` commands):

   ```bash
   npm run dev
   ```

   The web app runs at `http://localhost:3000`; the API runs at `http://localhost:5000`.

## Environment variables

| Variable | Location | Purpose |
| --- | --- | --- |
| `PORT` | `server/.env` | API listening port (default `5000`) |
| `MONGODB_URI` | `server/.env` | MongoDB database connection string |
| `CLIENT_URL` | `server/.env` | Allowed CORS origin; comma-separated origins supported |
| `NEXT_PUBLIC_API_URL` | `client/.env.local` | Browser API base URL, including `/api` |

No secrets are committed. The example environment files are [`server/.env.example`](server/.env.example) and [`client/.env.example`](client/.env.example).

## REST API

All responses use `{ success, data }` on success and `{ success: false, message, errors? }` on failure.

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/canvases` | Create canvas (201) |
| GET | `/api/canvases` | List canvases, newest first |
| GET | `/api/canvases/:id` | Load one canvas |
| PUT | `/api/canvases/:id` | Replace/update an existing canvas |
| DELETE | `/api/canvases/:id` | Delete a canvas |

Example create/update body:

```json
{
  "name": "Landing concept",
  "width": 900,
  "height": 600,
  "elements": [
    { "id": "shape-1", "type": "rectangle", "x": 100, "y": 100, "width": 150, "height": 100, "rotation": 0, "fill": "#635bff" }
  ]
}
```

The Mongoose model validates canvas dimensions, name, element types, IDs, numeric positions/rotation, positive dimensions/radii, colors, and text fields. Invalid IDs return 400; missing canvases return 404. JSON parser, Mongoose, route, and unexpected errors are normalized by middleware without exposing production stack traces.

## Konva design notes

`CanvasStage` is dynamically imported with SSR disabled, preventing browser API/hydration problems. It uses a single `Stage` and `Layer`, node refs, and a `Transformer` that reattaches whenever the selection changes. On transform end, it folds `scaleX` and `scaleY` into width/height (or circle radius), then resets node scale to 1. This keeps the persisted representation predictable. Dragging only changes local state; saving is explicit, so the API is never spammed while moving an item.

## Bonus features implemented

- Undo/redo with a bounded 50-state history.
- PNG export at 2× resolution, with the Transformer temporarily detached.
- Responsive canvas scaling and mobile toolbar.

## Verification and quality checks

Run the production client build from the root with `npm run build`. The backend can be checked by starting it with `npm run start --prefix server`; `GET /health` should return 200 after MongoDB connects. A full manual verification should cover element interactions, inspector edits, history hotkeys, save → reload → update → delete, invalid payloads, invalid IDs, empty canvases, and the unavailable API notification.

## Known limitations and future work

The editor intentionally supports a single 900×600 artboard, no authentication, no collaboration, and no image assets. Useful next steps are text-overlay editing, configurable artboard dimensions, layers/reordering, per-user access controls, automated API integration tests with an ephemeral MongoDB instance, and deployment using MongoDB Atlas plus a managed Node host.

## Deployment

Deploy `client` to a Next.js-capable platform and `server` to a Node host. Set the production API URL in `NEXT_PUBLIC_API_URL`, production client origin in `CLIENT_URL`, and use a managed MongoDB URI for `MONGODB_URI`. Configure the API host to run `npm run start` from `server`.
