# Spotify Fullstack (Clone + Admin + Backend)

This workspace contains three apps:

- **spotify-backend**: Express + MongoDB + Cloudinary API server
- **spotify-admin**: Admin dashboard (upload/manage songs & albums)
- **spotify-clone**: User-facing Spotify-style UI (playback, likes, playlists)

> Tip: All the big sections below are collapsible so the README stays compact.

---

<details>
<summary><strong>Quick Start</strong></summary>

## 1) Install dependencies

Open 3 terminals (one per folder) and run:

```bash
cd spotify-backend
npm install

cd ../spotify-admin
npm install

cd ../spotify-clone
npm install
```

## 2) Backend environment

Create `spotify-backend/.env` with at least:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_REGISTER_CODE` (only needed to bootstrap the *first* admin)
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY`

**Do not commit secrets.**

## 3) Run all apps

```bash
# Terminal 1
cd spotify-backend
npm run server

# Terminal 2
cd spotify-admin
npm run dev

# Terminal 3
cd spotify-clone
npm run dev
```

Default URLs:
- Backend: `http://localhost:4000`
- Admin: `http://localhost:5173`
- Clone: `http://localhost:5174` (or next available port)

</details>

---

<details>
<summary><strong>Workspace Structure</strong></summary>

```text
spotifyfullstack/
  spotify-admin/
    public/
    src/
      assets/
      components/
      context/
      pages/
    package.json

  spotify-backend/
    src/
      config/
      controller/
      middleware/
      models/
      routes/
    server.js
    package.json

  spotify-clone/
    public/
    src/
      assets/
      components/
      context/
    package.json
```

</details>

---

<details>
<summary><strong>spotify-backend (API Server)</strong></summary>

## Scripts

```bash
npm run server   # nodemon server.js
npm start        # node server.js
```

## Environment Variables

Create `spotify-backend/.env`:

```dotenv
# Mongo
MONGODB_URI="<your mongo connection string>"

# Auth
JWT_SECRET="<strong secret>"
JWT_EXPIRES_IN="7d"

# Admin bootstrap (first admin only)
ADMIN_REGISTER_CODE="<your code>"

# Cloudinary
CLOUDINARY_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_SECRET_KEY="..."
```

## Routes (high-level)

### Public
- `GET /api/song/list`
- `GET /api/album/list`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Admin-only (requires Bearer token of an admin)
- `POST /api/song/add`
- `POST /api/song/remove`
- `POST /api/album/add`
- `POST /api/album/remove`

### User data (requires login)
- `GET /api/user/likes`
- `POST /api/user/likes/toggle`
- `GET /api/playlist/list`
- `POST /api/playlist/create`
- `POST /api/playlist/add-track`
- `POST /api/playlist/remove-track`

</details>

---

<details>
<summary><strong>spotify-admin (Admin Dashboard)</strong></summary>

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## What it does
- Login as an admin
- Upload songs/albums to Cloudinary via the backend
- Manage (list/remove) songs/albums

## Notes
- The admin app stores its auth token in `localStorage` (key: `admin_token`).
- The backend must be running for uploads and listings.

</details>

---

<details>
<summary><strong>spotify-clone (User App)</strong></summary>

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## What it does
- Displays songs/albums from the backend
- Plays audio
- Supports login/register
- Likes + playlists per-user (requires backend auth)

## Notes
- Auth token is stored in `localStorage` (key: `token`).
- By default, the clone uses `VITE_API_URL` if set, otherwise `http://localhost:4000`.

Create `spotify-clone/.env` if you want a custom API base:

```dotenv
VITE_API_URL="http://localhost:4000"
```

</details>

---

<details>
<summary><strong>Admin Creation Flow</strong></summary>

## First admin (bootstrap)
Use `POST /api/auth/register` with `adminCode` matching `ADMIN_REGISTER_CODE`.

After at least one admin exists, the recommended pattern is:
- normal registration creates **users** only
- **existing admins** create more admins using an admin-protected endpoint (no code required)

If you want this fully wired end-to-end, add:
- `POST /api/auth/admin/create` (protected by admin middleware)
- an Admin UI page (e.g. “Add Admin”) that calls it

</details>

---

<details>
<summary><strong>Troubleshooting</strong></summary>

- **Clone/Admin can’t reach backend**: ensure backend is running on `http://localhost:4000`.
- **MongoDB connect errors**: verify `MONGODB_URI` and that Atlas IP allowlist includes your IP.
- **401/403 errors**: confirm you’re logged in and sending `Authorization: Bearer <token>`.
- **Uploads fail**: ensure Cloudinary env vars are present and valid.

</details>

---

<details>
<summary><strong>Credits</strong></summary>

- Tutorial inspiration: [How To Create Full Stack Spotify Clone App In React JS | Music Streaming Site in MERN Stack 2024](https://www.youtube.com/watch?v=KdGfhSpT6pc&t=20466s)
- Creator: [GreatStack (YouTube)](https://www.youtube.com/results?search_query=GreatStack)
- Notes: Built for learning; Spotify and related trademarks/assets belong to their respective owners.

</details>

