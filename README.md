# Peer-to-Peer Rental Marketplace (RentIt)

RentIt is a full-stack MERN application enabling a secure Peer-to-Peer (P2P) rental environment. Users can lease their items (like cameras, laptops, vehicles, camping gear) or rent from neighbors in their local area, optimizing resource usage and promoting sustainability.

This project was built as a Computer Science & Engineering Final Year Major Project to demonstrate modern MVC API patterns and reactive single-page client design.

---

## Objectives
- **Resource Optimization:** Reduce waste by sharing underutilized items.
- **Trust Ecosystem:** Provide a verified environment with profiles, reviews, and transaction auditing.
- **Simplified Logistics:** Location and condition filters to streamline local pick-ups.
- **Interactive UI:** Dark mode styling, loading skeletons, and notification alerts.

---

## Features
- **Secure Authentication:** Full JWT token lifecycle featuring short-lived access tokens and refresh tokens in HttpOnly cookies.
- **Booking Flow:** Owners can accept or decline booking requests, tracking dates for collisions.
- **Moderate Command Center:** Admins can oversee listings, wipe accounts, and view platform transaction statistics.
- **Advanced Querying:** Full-text searches on description fields combined with categories, conditions, and price ranges.
- **Theme Adaptation:** Native CSS variables toggling HSL coordinated light/dark aesthetics.

---

## Technology Stack

### Backend
- **NodeJS & ExpressJS:** Main application architecture.
- **MongoDB & Mongoose:** Relational mapping schemas with automatic text indexes.
- **JWT & bcryptjs:** Credentials hashing and session protection.
- **express-validator:** Data validation middleware.
- **multer:** Form multipart image parsing.
- **helmet & express-rate-limit:** Security headers and traffic throttling.

### Frontend
- **ReactJS & Vite:** Dynamic single page rendering.
- **React Router DOM:** Role guarded declarative client routing.
- **Axios:** Session interceptors with automated token refresh.
- **Context API:** Global login status and styling theme indicators.
- **Framer Motion & React Icons:** Standard transitions and iconography.

---

## Folder Structure

```
Summer_Internship/
├── backend/
│   ├── config/             # Connection managers (db, cloudinary)
│   ├── controllers/        # Core route logic (auth, items, bookings...)
│   ├── middleware/         # Session guard, multer uploads, error maps
│   ├── models/             # Database schemas (User, Item, Wishlist...)
│   ├── routes/             # REST route bindings
│   ├── utils/              # Token issuer, email dispatcher, logger
│   ├── validators/         # Input constraints rules
│   ├── app.js              # Entrypoint server script
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable layout cards and buttons
    │   ├── context/        # Styles & auth global providers
    │   ├── hooks/          # Custom hooks (useAuth, useFetch)
    │   ├── pages/          # Full page views
    │   ├── services/       # Client api callers
    │   ├── styles/         # App.css, main.css
    │   ├── utils/          # Formatting helpers & validators
    │   ├── App.jsx         # Routes configuration
    │   └── main.jsx        # Mount configuration
    ├── index.html
    └── package.json
```

---

## Environment Variables

### Backend (.env)
Create a `.env` file under the `/backend` folder:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/p2p-rental

# JWT Secret Keys
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
REFRESH_TOKEN_EXPIRY=7d

# SMTP Mail Server (Optional - simulated in console if empty)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=smtp_username
EMAIL_PASS=smtp_password
FROM_NAME="RentIt Support"
FROM_EMAIL=noreply@rentit.com

# Cloudinary Storage (Optional - falls back to local storage if empty)
CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret
```

---

## Installation Steps

### Prerequisites
- NodeJS (v16+)
- MongoDB running locally or a MongoDB Atlas URI

### Setup Backend
1. Go to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables: Create a `.env` file based on `.env.example`
4. Start development server:
   ```bash
   npm run dev
   ```

### Setup Frontend
1. Go to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Access client at `http://localhost:5173`

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create user profile
- `POST /api/auth/login` - Authenticate member session
- `POST /api/auth/logout` - Invalidate refresh token and clear cookies
- `POST /api/auth/refresh-token` - Issue new access token
- `POST /api/auth/forgot-password` - Dispatch password reset tokens
- `PUT /api/auth/reset-password/:resettoken` - Reset credentials

### Users
- `GET /api/users/profile` - Fetch authenticated user info
- `PUT /api/users/profile` - Update profile name and phone number
- `PATCH /api/users/profile/image` - Upload user profile avatar
- `DELETE /api/users/profile` - Remove account and listings

### Rental Items
- `POST /api/items` - Create listing (Requires files upload)
- `GET /api/items` - Fetch and search items (Public)
- `GET /api/items/:id` - Fetch item details (Public)
- `PUT /api/items/:id` - Edit listing
- `DELETE /api/items/:id` - Remove listing

### Bookings
- `POST /api/bookings` - Submit rental request
- `GET /api/bookings` - Retrieve booking history
- `PATCH /api/bookings/:id/cancel` - Cancel booking request
- `PATCH /api/bookings/:id/approve` - Approve request (Owner only)
- `PATCH /api/bookings/:id/reject` - Decline request (Owner only)

### Moderation
- `GET /api/admin/statistics` - Platform revenue and bookings breakdown (Admin only)
- `GET /api/admin/users` - Registered members (Admin only)
- `DELETE /api/admin/users/:id` - Wipe user and postings (Admin only)

---

## Deployment Guide

### Database
Sign up for a free tier database at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). Whitelist access IPs and grab your connection URI string to put in the backend `.env` variables.

### Backend (Render)
1. Link your GitHub repository to Render.
2. Select **Web Service**.
3. Build command: `npm install`
4. Start command: `npm start`
5. Configure Environment Variables in the service settings dashboard.

### Frontend (Vercel)
1. Install vercel CLI or connect your Git repo to Vercel dashboard.
2. Ensure proxy config or API paths resolve to your Render service domain URL.
3. Deploy!

---

## License
Distributed under the MIT License. See `LICENSE` for more information.
