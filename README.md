# MS Footwear — Peshawari Chappal E-commerce Website

A full-stack MERN e-commerce website for **MS Footwear**, a Peshawari Chappal / traditional
footwear business. Customers can browse, search, and order without creating an account
(Cash on Delivery or manual Easypaisa payment). There is a single, secure admin account
for managing products and orders.

---

## 1. Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios, React Icons
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth:** JWT + bcryptjs (single admin account only)
- **Images:** ImageKit (server-side only, via `backend/services/imagekitService.js`)
- **Security:** Helmet, CORS, express-rate-limit, express-validator
- **No** Firebase / Supabase / Stripe / PayPal / bank or Easypaisa API — payment is COD or
  **manual** Easypaisa (customer sends payment + WhatsApp screenshot).

---

## 2. Project Structure

```
MS-Footwear/
├── frontend/         React + Vite + Tailwind app
├── backend/          Express API + MongoDB models
├── .gitignore
└── README.md
```

See `backend/` and `frontend/` for their internal structure — each folder is organized by
responsibility (controllers, models, routes, services, etc. on the backend; components,
pages, context, services on the frontend).

---

## 3. One File to Change Contact Details

- **Frontend:** `frontend/src/config/siteConfig.js` — WhatsApp number, Facebook URL, phone,
  email, tagline.
- **Backend:** `backend/config/siteConfig.js` — same values, sourced from `backend/.env`
  (used for the public `/api/config` endpoint, which also supplies the live Easypaisa number
  to the checkout page).

Update the Facebook URL in **both** places (or just the `.env` `FACEBOOK_URL` value, which
feeds the backend copy) once you have your real page.

---

## 4. Local Development

### Backend

```bash
cd backend
npm install
cp .env.example .env      # then fill in real values
npm run dev                # starts on http://localhost:5000
```

Seed the database (5 sample products + the one admin account, from `ADMIN_EMAIL` /
`ADMIN_PASSWORD` in `.env`):

```bash
npm run seed
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env       # set VITE_API_URL if different from default
npm run dev                 # starts on http://localhost:5173
```

The frontend calls the backend at `VITE_API_URL` (default `http://localhost:5000/api`).
Make sure `CLIENT_URL` in `backend/.env` matches the frontend's URL so CORS allows requests.

---

## 5. Environment Variables

### `backend/.env`
See `backend/.env.example` for the full list. Key ones:

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign admin JWTs |
| `CLIENT_URL` | Frontend origin, used for CORS |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used **once** by `npm run seed` to create the single admin account |
| `IMAGEKIT_PUBLIC_KEY` / `IMAGEKIT_PRIVATE_KEY` / `IMAGEKIT_URL_ENDPOINT` | ImageKit credentials (private key is never sent to the frontend) |
| `EASYPAISA_NUMBER` / `EASYPAISA_ACCOUNT_NAME` | Shown at checkout for manual Easypaisa payment |
| `WHATSAPP_NUMBER`, `BUSINESS_PHONE`, `BUSINESS_EMAIL`, `FACEBOOK_URL` | Public contact info |

### `frontend/.env`
| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

**Never commit real `.env` files** — only `.env.example` files are tracked.

---

## 6. Admin Account

- There is **only one** admin account, created by `npm run seed` from `ADMIN_EMAIL` /
  `ADMIN_PASSWORD`. There is no public registration or signup page.
- Log in at `/admin/login`. A small "Admin" link in the footer navigates there — it does not
  expose the dashboard itself.
- After login, the dashboard, product management, and order management are protected by JWT
  (`backend/middleware/authMiddleware.js`) — all admin API routes require a valid token.
- **Change `ADMIN_PASSWORD` to a strong, unique password before deploying**, and rotate
  `JWT_SECRET` to a long random string.

---

## 7. Deployment

### 7.1 MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow network access (or `0.0.0.0/0` for simplicity, tightened
   later).
3. Copy the connection string into `MONGO_URI`.

### 7.2 ImageKit
1. Create an account at [imagekit.io](https://imagekit.io).
2. Copy your Public Key, Private Key, and URL Endpoint into `backend/.env`.
3. Never expose `IMAGEKIT_PRIVATE_KEY` in any frontend code or public repo.

### 7.3 Backend environment variables
Set all variables from `backend/.env.example` in your hosting platform's dashboard
(Render, etc.) — do not upload the `.env` file itself.

### 7.4 Render (backend)
1. Push the repo to GitHub.
2. Create a new **Web Service** on [Render](https://render.com), pointing at the `backend/`
   directory (set the root directory to `backend`).
3. Build command: `npm install`. Start command: `npm start`.
4. Add all backend environment variables in the Render dashboard.
5. After the first deploy, run `npm run seed` locally (pointed at the Atlas URI) or via
   Render's shell to create products + the admin account.

### 7.5 Frontend environment variables
Set `VITE_API_URL` to your deployed backend URL, e.g. `https://ms-footwear-api.onrender.com/api`.

### 7.6 Vercel (frontend)
1. Import the repo into [Vercel](https://vercel.com), set the root directory to `frontend`.
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Add `VITE_API_URL` as an environment variable in the Vercel dashboard.
4. Deploy.

### 7.7 CORS configuration
Set `CLIENT_URL` in the backend's environment variables to your deployed Vercel URL
(e.g. `https://ms-footwear.vercel.app`) so the browser is allowed to call the API.

### 7.8 Admin login setup (production)
1. Set a strong `ADMIN_PASSWORD` and a long random `JWT_SECRET` in the backend's production
   environment variables.
2. Run the seed script once against the production database to create the single admin
   account (or create it manually via a one-off script — never expose a signup endpoint).
3. Log in at `https://yourdomain.com/admin/login`.

---

## 8. Replacing Placeholder Content

- **Hero image:** replace `frontend/public/assets/hero-placeholder.svg` references with a
  real photo at `frontend/public/assets/hero.jpg` (update the `<img>` `src` in
  `src/pages/Home.jsx` and `src/pages/About.jsx`).
- **Products:** replace the 5 seeded products via the admin dashboard, or edit
  `backend/seed.js` and re-run `npm run seed`.
- **Facebook URL:** update `FACEBOOK_URL` in `backend/.env` and `facebookUrl` in
  `frontend/src/config/siteConfig.js`.
- **Easypaisa number:** update `EASYPAISA_NUMBER` in `backend/.env` — it's pulled live by the
  checkout page via `/api/config`.

---

## 9. Key Security Notes

- Prices/totals are **always** recalculated server-side from MongoDB — the frontend cannot
  manipulate order totals (`backend/controllers/orderController.js`).
- Passwords are hashed with bcrypt; the admin password is never exposed to the client.
- Payment screenshots are **never** uploaded to the server — WhatsApp handles them manually,
  per the "no online payment gateway" requirement.
- Rate limiting, Helmet, and CORS are enabled on all `/api` routes.
