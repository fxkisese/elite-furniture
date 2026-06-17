# Elite Space Furniture — Premium Furniture & Custom Glass Solutions

**Elite Space Furniture** is a Kenyan furniture and custom glass business with branches in Kyumbi (Machakos Junction) and Whitehouse Footbridge, Tena Estate, Nairobi. This repository contains the full-stack web application for the business — built on React, Vite, Supabase, and Tailwind CSS, deployed on Vercel.

🌐 **Live Site:** [elite-furniture-virid.vercel.app](https://elite-furniture-virid.vercel.app)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + shadcn/ui + Radix UI |
| Backend / DB | Supabase (PostgreSQL + Storage) |
| Deployment | Vercel |
| Payments | M-PESA Daraja API *(in progress)* |

---

## Features

- 🛋️ **Products Page** — browse furniture and glass products with category filters, price range filters, and best-seller highlights
- 📐 **Custom Orders** — multi-line quote builder for bespoke furniture and glass requests; pricing handled by the team after submission
- 📬 **Contact Page** — reach either branch directly via form or phone
- 🏢 **About Page** — business story, branch locations, showroom gallery, before & after transformations, FAQs, and TikTok feed
- 🔐 **Admin Panel** — 8-tab dashboard (Dashboard, Products, Sales, Credit Book, Expenses, Reports, Messages, Quotes)
- 💳 **M-PESA Integration** — 40% deposit model via Safaricom Daraja STK Push *(in progress)*
- 🔒 **Security** — input sanitization on all user-facing forms before writing to DB

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project ([supabase.com](https://supabase.com))

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/fxkisese/elite-furniture.git
cd elite-furniture

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_WHATSAPP=your_whatsapp_number
```

```bash
# 4. Run locally
npm run dev
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key (safe for frontend) |
| `VITE_ADMIN_WHATSAPP` | WhatsApp number for order notifications |

> ⚠️ Never commit `.env.local` or expose your `service_role` key.  
> For M-PESA, keep `CONSUMER_KEY` and `CONSUMER_SECRET` in Supabase Edge Function environment variables only — never in React.

---

## Project Structure

```
elite-furniture/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── cart/           # Cart drawer & cart logic
│   │   ├── layout/         # PageLayout, Navbar, Footer
│   │   ├── showroom-components/  # Featured product cards
│   │   ├── testimonials/   # Reviews & testimonials
│   │   └── ui/             # shadcn/ui base components
│   ├── pages/              # Route-level pages
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── CustomOrders.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Checkout.jsx
│   │   └── Admin.jsx
│   └── lib/                # Supabase client, utilities, sanitization
│       ├── supabase.js
│       ├── sanitize.js
│       ├── CartContext.jsx
│       └── utils.js
├── supabase/               # DB schema & migrations
├── public/                 # Static assets
└── entities/               # Data models
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Lint the codebase |
| `npm run lint:fix` | Auto-fix lint errors |

---

## Deployment

The app deploys automatically to Vercel on every push to `main`.

To build manually:
```bash
npm run build
# Push to GitHub — Vercel picks it up automatically
```

Add your environment variables under:
**Vercel → Project Settings → Environment Variables**

---

## Business

**Elite Space Furniture**
- 📍 Branch 1: Kyumbi, Machakos Junction (Mombasa Road)
- 📍 Branch 2: Whitehouse Footbridge, Tena Estate, Nairobi (Manyanja Road)
- 📞 +254 793 816 450
- 🛒 Custom furniture, glass solutions, and interior fittings

---

## License

Private — all rights reserved © Elite Space Furniture
