# Visited

A full-stack app for sharing the places you've visited. Users sign up with a profile picture, then add, edit and delete places with photos and view each one on a map.

- **Client:** React 19, React Router 7, Vite (`client/`)
- **Server:** Express 5, Mongoose 9, Multer, JWT auth (`server/`)

## Requirements

- Node.js 20.19+
- A MongoDB database that supports transactions, either a MongoDB Atlas cluster or a local replica set

## Getting started

### Server

```bash
cd server
npm install
cp .env.example .env   # then fill in your values
npm start              # nodemon, http://localhost:5000
```

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | Full MongoDB connection string (optional, overrides the Atlas variables) |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Atlas credentials, used when `MONGODB_URI` is not set |
| `JWT_KEY` | Secret used to sign auth tokens |
| `PORT` | Port to listen on (default `5000`) |

Uploaded images are stored in `server/uploads/images`. Run the server from the `server/` directory.

### Client

```bash
cd client
npm install
npm start              # http://localhost:3000
npm run build          # production build in client/build
```

The client talks to `http://localhost:5000` by default. To point it somewhere else, set these in `client/.env.production` or `client/.env.local`:

```
VITE_BACKEND_URL=https://your-api.example.com/api
VITE_ASSET_URL=https://your-api.example.com
```

## Upcoming

- Geocoding addresses to real coordinates (`server/util/location.js` currently returns fixed coordinates)
