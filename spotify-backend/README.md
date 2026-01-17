# spotify-backend

Express + MongoDB + Cloudinary API server for the Spotify clone.

## Run

```bash
npm install
npm run server
```

## Environment

For the deployed demo, environment variables are set in Render.

For local development only, copy the template and fill your values:

```bash
copy .env.example .env
```

Required keys live in `.env`:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_REGISTER_CODE` (only needed to bootstrap the first admin)
- `OWNER_ADMIN_ID` (prevents the owner admin from being deleted/demoted)
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY`

---

## Credits
- Tutorial inspiration: [How To Create Full Stack Spotify Clone App In React JS | Music Streaming Site in MERN Stack 2024](https://www.youtube.com/watch?v=KdGfhSpT6pc&t=20466s)
- Creator: [GreatStack (YouTube)](https://www.youtube.com/results?search_query=GreatStack)

