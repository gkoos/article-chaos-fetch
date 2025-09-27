# Next.js Recipe App

This is a minimal fullstack Next.js app that demonstrates:
- Optimistic UI updates for likes
- In-memory backend API routes
- Tailwind CSS v3 for styling
- Real frontend ↔ backend calls (no mocks)

## Features

- Browse a list of 3 simple recipes
- View recipe details and like them with instant optimistic feedback
- Likes are stored in-memory and reset on server restart
- API routes:
	- `GET /api/posts` — list all recipes
	- `GET /api/posts/[id]` — get recipe details
	- `POST /api/posts/[id]/like` — increment likes

## Getting Started

Run the development server:

```bash
npm run dev
```

Open <http://localhost:3000> in your browser.

## Folder Structure

- `src/app/api/posts/data.ts` — in-memory recipe data
- `src/app/page.tsx` — recipe list page
- `src/app/posts/[id]/page.tsx` — recipe detail page
- `src/components/LikeButton.tsx` — optimistic like button

## Tech Stack

- Next.js (App Router, API routes)
- Tailwind CSS v3
- TypeScript

## License

MIT
