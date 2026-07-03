# Umunsi.com — Magazine Website

A modern, full-width, mobile-responsive magazine website built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Prisma (PostgreSQL)**.

## Features

### Frontend (Public)
- **Full-width hero slider** with autoplay on homepage
- **Breaking news ticker** with scrolling animation
- **10 categories**: Inkuru Nyamukuru, Amatangazo, Cinema, Hanze, Health, Ikoranabuhanga, Imikino, Imyidagaduro, Inkuru ku Rwanda, Akazi
- **Article pages** with cover images, in-article images, YouTube embeds, captions, tags, related posts
- **Category pages** with filtered post grids
- **Search page** with live filtering
- **About & Contact** pages
- **Trending sidebar** with most-viewed posts
- **Amazing footer** with newsletter signup, social links, contact info
- **Fully mobile responsive** — looks stunning on phone and desktop
- **Optimized images** with Next.js Image (WebP/AVIF)
- **Kinyarwanda UI** with English fallbacks

### Admin Dashboard (`/admin`)
- **Login system** with JWT auth
- **Dashboard** with stats (posts, views, media, categories)
- **Posts management** — list, search, filter, create, edit, delete
- **Post editor** with:
  - Title, excerpt, content (HTML)
  - Category selector
  - Cover image with live preview
  - Featured toggle (homepage slider)
  - Tags manager
  - **Media manager** — add images & YouTube links with captions
- **Media Library** — grid view, filter by type (image/YouTube), detail modal with caption, URL copy
- **Categories management** — add, edit, delete with color picker
- **Settings** — site name, description, contact info, social media links

### Backend
- **PostgreSQL** database via Prisma ORM
- **API routes** for posts, categories, media, search, auth
- **JWT authentication** for admin
- **Seed script** with all 10 categories and admin user

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Carousel | Embla Carousel |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcryptjs |

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.example` to `.env` and update with your PostgreSQL connection:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/umunsi?schema=public"
JWT_SECRET="your-secure-random-string"
ADMIN_EMAIL="admin@umunsi.com"
ADMIN_PASSWORD="admin123"
```

### 3. Generate Prisma client & run migrations
```bash
npm run db:generate
npm run db:migrate
```

### 4. Seed the database
```bash
npm run db:seed
```

### 5. Run the dev server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Admin Access

- URL: `http://localhost:3000/admin`
- Email: `admin@umunsi.com`
- Password: `admin123`

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage with hero slider
│   ├── article/[slug]/       # Article detail page
│   ├── category/[slug]/      # Category listing page
│   ├── search/               # Search page
│   ├── about/                # About page
│   ├── contact/              # Contact page
│   ├── admin/                # Admin dashboard
│   │   ├── layout.tsx        # Admin sidebar layout
│   │   ├── login/            # Login page
│   │   ├── page.tsx          # Dashboard overview
│   │   ├── posts/            # Posts list & editor
│   │   ├── media/            # Media library
│   │   ├── categories/       # Category management
│   │   └── settings/         # Site settings
│   └── api/                  # API routes
│       ├── posts/            # Posts CRUD
│       ├── categories/       # Categories CRUD
│       ├── media/            # Media CRUD
│       ├── search/           # Search API
│       └── auth/login/       # Auth API
├── components/
│   ├── layout/               # Header & Footer
│   └── home/                 # HeroSlider, ArticleCard, etc.
└── lib/
    ├── data.ts               # Mock data (replace with API)
    ├── prisma.ts             # Prisma client
    └── utils.ts              # Utilities
```

## Database Schema

- **Category**: slug, name, color, icon, order
- **Post**: slug, title, excerpt, content, featured, published, views, tags
- **Media**: url, type (image/video/youtube), caption, alt
- **Author**: name, email, role, avatar, bio
- **User**: email, password (hashed), role
- **Setting**: key-value pairs for site config

## Performance

- Next.js Image optimization (WebP/AVIF)
- Font optimization with `next/font`
- Autoplay carousel with pause on hover
- Lazy loading for below-fold images
- Tailwind CSS purging for minimal CSS

## License

© Umunsi.com — All rights reserved.
