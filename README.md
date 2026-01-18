# Spotify Fullstack (Clone + Admin + Backend)

This workspace contains three apps:

- **spotify-backend**: Express + MongoDB + Cloudinary API server
- **spotify-admin**: Admin dashboard (upload/manage songs & albums)
- **spotify-clone**: User-facing Spotify-style UI (playback, likes, playlists)

## Attribution

- Tutorial followed: **How To Create Full Stack Spotify Clone App In React JS | Music Streaming Site in MERN Stack 2024** (GreatStack).
- “Spotify” is a trademark of Spotify AB. This project is for educational purposes and is not affiliated with, endorsed by, or sponsored by Spotify.

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

For the live demos, environment variables are configured in the hosting providers (Vercel for the frontends, Render for the backend). No `.env` files are included in this repo.

For local development only, copy the backend template and fill your values:

```bash
cd spotify-backend
copy .env.example .env
```

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
- Clone: `http://localhost:5173` (Vite default)
- Admin: `http://localhost:5174` (or next available port)

