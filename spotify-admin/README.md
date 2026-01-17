# spotify-admin

Admin dashboard for managing songs/albums and admin accounts.

## Run (dev)

```bash
npm install
npm run dev
```

## Environment

For the deployed demo, environment variables are set in Vercel.

By default (local dev), the admin uses http://localhost:4000 for the API.

Optional (local dev only): copy the template and edit values:

```bash
copy .env.example .env
```

Available keys:

- `VITE_API_URL` (backend API base URL)
- `VITE_APP_URL` (optional: where the "Back to App" button should go)

## Notes
- Expects the backend API to be running (default: `http://localhost:4000`).
- Stores admin auth token in `localStorage` (key: `admin_token`).

---

## Credits
- Tutorial inspiration: [How To Create Full Stack Spotify Clone App In React JS | Music Streaming Site in MERN Stack 2024](https://www.youtube.com/watch?v=KdGfhSpT6pc&t=20466s)
- Creator: [GreatStack (YouTube)](https://www.youtube.com/results?search_query=GreatStack)

