# Visited

A full-stack demo app for sharing the places you've visited. Users sign up with a profile picture, then add, edit and delete places with photos and view each one on a map.

- **Client:** React 19, React Router 7, Vite (`client/`)
- **Server:** Express 5, SQLite (built into Node), Multer, JWT auth (`server/`)

It runs entirely locally: no database server, accounts or environment variables needed.

## Requirements

- Node.js 22.13+ (uses the built-in `node:sqlite` module)

## Getting started

```bash
npm install   # installs root, server and client dependencies
npm run dev   # starts the API on http://localhost:5000 and the app on http://localhost:3000
```

Or run each part on its own with `npm start` inside `server/` or `client/`.

## Where data lives

- **Database:** `server/data/visited.db`, created automatically on first start. Delete the `server/data` folder to start fresh.
- **Uploaded images:** `server/uploads/images`

## Optional configuration

Everything has a working default. To override, copy `server/.env.example` to `server/.env`:

| Variable | Default |
| --- | --- |
| `PORT` | `5000` |
| `JWT_KEY` | a built-in local development secret |
| `DB_FILE` | `server/data/visited.db` |

If you change the API port, point the client at it in `client/.env.local`:

```
VITE_BACKEND_URL=http://localhost:5000/api
VITE_ASSET_URL=http://localhost:5000
```

## Upcoming

- Geocoding addresses to real coordinates (`server/util/location.js` currently returns fixed coordinates)
