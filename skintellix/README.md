# ✦ Skintellix — Smart Skin. Smart Choices.

> A MERN stack skincare recommendation and beauty shopping platform designed for Indian users.

![Skintellix Banner](https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&h=400&fit=crop&q=80)

---

## 🌟 Overview

**Skintellix** is a full-stack, production-ready Indian beauty platform that combines:

- 🔬 **Skin Analysis based on user responses** — 5-question quiz identifies skin type, tone & concerns
- 💰 **Multi-platform Price Comparison** — Same product compared across Amazon, Flipkart, Nykaa, Myntra, Purplle, Tata CLiQ, Meesho, AJIO, BigBasket & Blinkit
- 💄 **Makeup Recommendations** — Shade finder for all Indian skin tones (Fair → Deep)
- 🛍️ **150+ Curated Products** — Skincare, makeup, haircare & bodycare
- 🌐 **Web Application** — Designed to run in modern desktop web browsers
- 🇮🇳 **Built for India** — Designed for Indian skin tones, budgets & platforms

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | UI framework |
| React Router v6 | Client-side routing |
| Tailwind CSS | Styling with custom Indian aesthetic |
| Zustand | Global state management |
| Framer Motion | Animations |
| React Hot Toast | Notifications |
| Recharts | Price history charts |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Primary database |
| Redis | Caching & sessions |
| JWT | Authentication |
| Helmet + CORS | Security |
| Multer | File uploads |
| Node-cron | Price update scheduler |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| Docker + Docker Compose | Containerization |
| Nginx | Reverse proxy + SPA serving |
| MongoDB Atlas | Cloud database (production) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- MongoDB (local or Atlas)
- Redis (local or cloud) for caching
- Docker & Docker Compose (optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shahina26/Skintellix-SkinAnalysisApp.git
   cd skintellix
   ```

2. Install dependencies from the root workspace:
   ```bash
   npm install
   ```

This installs:
- Root workspace dependencies (`concurrently`)
- Frontend dependencies in `frontend/`
- Backend dependencies in `backend/`

### Running the Application

#### Development Mode

Run both frontend and backend together:

```bash
npm run dev
```

This starts:
- Backend API server on http://localhost:5000
- Frontend development server on http://localhost:3000 (or next available port if 3000 is already in use)

If you need to run the services separately:

Backend only:
```bash
cd backend
npm run dev
```

Frontend only:
```bash
cd frontend
npm run dev
```

#### Docker Mode

Build and start all services using Docker Compose:

```bash
docker-compose up --build
```

Services included:
- MongoDB on port 27017
- Redis on port 6379
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000

### Environment Variables

Create a `.env` file in the `backend/` directory by copying `.env.example`:

```bash
cd backend
cp .env.example .env
```

Then configure values for:
- `MONGODB_URI`
- `REDIS_URL`
- `JWT_SECRET`
- `FRONTEND_URL`
- `GOOGLE_VISION_API_KEY`, `OPENAI_API_KEY`, and other third-party keys if used

> Note: `backend/.env.example` already includes default local values for MongoDB and Redis.

---

## 📁 Project Structure

```
skintellix/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx       # Responsive navbar with search
│   │   │   ├── Footer.jsx       # Full footer with newsletter
│   │   │   ├── ProductCard.jsx  # Product card with price comparison
│   │   │   └── LoadingScreen.jsx
│   │   ├── pages/               # All application pages
│   │   │   ├── Home.jsx         # Landing page (hero, features, products)
│   │   │   ├── SkinQuiz.jsx     # Multi-step skin analysis quiz
│   │   │   ├── Results.jsx      # Analysis results + recommendations
│   │   │   ├── Products.jsx     # Product listing with filters
│   │   │   ├── ProductDetail.jsx # Product detail + price comparison
│   │   │   ├── Makeup.jsx       # Makeup shade finder + looks
│   │   │   ├── Compare.jsx      # Side-by-side product comparison
│   │   │   ├── Blog.jsx         # Beauty education articles
│   │   │   ├── Dashboard.jsx    # User profile & wishlist
│   │   │   ├── Login.jsx        # Authentication
│   │   │   ├── Register.jsx     # User registration
│   │   │   └── About.jsx        # About Skintellix
│   │   ├── hooks/
│   │   │   └── useStore.js      # Zustand store (auth, wishlist, compare)
│   │   ├── utils/
│   │   │   └── api.js           # Axios API service layer
│   │   ├── App.jsx              # Router setup
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles + Tailwind
│   ├── tailwind.config.js       # Custom design tokens
│   ├── vite.config.js
│   └── Dockerfile
│
├── backend/                     # Node.js + Express API
│   ├── routes/
│   │   ├── auth.js              # Login, register, profile
│   │   ├── products.js          # Products CRUD + search + filters
│   │   ├── skinAnalysis.js      # AI skin quiz & analysis
│   │   ├── compare.js           # Price comparison & history
│   │   ├── makeup.js            # Shade guide & recommendations
│   │   ├── user.js              # Wishlist & preferences
│   │   ├── reviews.js           # Product reviews
│   │   ├── ingredients.js       # Ingredient database
│   │   └── blog.js              # Beauty articles
│   ├── models/
│   │   ├── User.js              # User schema with skin profile
│   │   └── Product.js           # Product schema with platform prices
│   ├── services/
│   │   ├── skinAnalysisService.js   # AI skin analysis logic
│   │   └── priceComparisonService.js # Price comparison engine
│   ├── data/
│   │   └── products.js          # 150+ real product dataset
│   ├── middleware/
│   ├── server.js                # Express app setup
│   ├── .env.example
│   └── Dockerfile
│
├── docker-compose.yml           # Full stack Docker setup
└── README.md
```

---


### Prerequisites
- Node.js 18+ 
- npm 9+
- MongoDB (local or Atlas)
- Redis (optional, for caching)

### Option 1: Local Development

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/skintellix.git
cd skintellix

# 2. Setup Backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and other secrets
npm install
npm run dev
# Backend runs at http://localhost:5000

# 3. Setup Frontend (new terminal)
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:3000
```

### Option 2: Docker (Recommended for Production)

```bash
# Build and start all services
docker-compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# MongoDB: mongodb://localhost:27017
```

---

## 🔌 API Endpoints

### Products
```
GET  /api/products              # List with filters (category, skinType, price, etc.)
GET  /api/products/featured     # Trending, bestsellers, expert picks
GET  /api/products/:id          # Product detail + price comparison
GET  /api/products/search/suggestions  # Search autocomplete
GET  /api/products/categories   # Category tree
```

### Skin Analysis
```
GET  /api/skin/quiz             # Quiz questions
POST /api/skin/analyze          # Analyze from quiz answers
POST /api/skin/analyze-image    # Analyze from uploaded image (AI)
```

### Price Comparison
```
GET  /api/compare?ids=id1,id2   # Compare multiple products
GET  /api/compare/price-history/:id/:platform  # 30-day price history
```

### Makeup
```
GET  /api/makeup/recommend      # Makeup recommendations by skin tone
GET  /api/makeup/shade-guide/:tone  # Shade guide for skin tone
GET  /api/makeup/looks          # Makeup look categories
GET  /api/makeup/tutorials      # Video tutorials
```

### Auth
```
POST /api/auth/register         # Create account
POST /api/auth/login            # Sign in
GET  /api/auth/me               # Get profile
PATCH /api/auth/skin-profile    # Update skin profile
```

### Blog & Content
```
GET  /api/blog                  # Article list
GET  /api/blog/:slug            # Article detail
GET  /api/ingredients/:slug     # Ingredient info
GET  /api/ingredients/search    # Ingredient search
```

---

## 🛍️ Platforms Integrated

| Platform | Type | Delivery |
|----------|------|----------|
| 🛒 Amazon | General | 1-3 days |
| 🏬 Flipkart | General | 1-2 days |
| 💄 Nykaa | Beauty specialist | 3-5 days |
| 👗 Myntra | Fashion & beauty | 3-5 days |
| 💜 Purplle | Beauty specialist | 4-6 days |
| 🔴 Tata CLiQ | Premium/Luxury | 3-5 days |
| 🌸 Meesho | Budget-friendly | 5-7 days |
| 🔶 AJIO | Fashion & beauty | 3-5 days |
| 🧺 BigBasket | Grocery & personal care | Same day |
| ⚡ Blinkit | Quick commerce | 10 minutes |

---

## 🎨 Design System

### Colors
```css
--rose-blush:  #F7E8E8   /* Backgrounds */
--rose-medium: #D4737A   /* Accents */
--rose-deep:   #A8404B   /* Primary CTAs */
--gold-medium: #C9A84C   /* Premium badges */
--cream-50:    #FFFBF7   /* Page backgrounds */
--charcoal-900: #1A1410  /* Dark sections */
```

### Typography
- **Display:** Cormorant Garamond (headings, brand)
- **Body:** DM Sans (UI text, descriptions)
- **Accent:** Playfair Display (editorial content)

---

## 🌿 Product Features Supported

- ✅ Vegan
- ✅ Cruelty-Free  
- ✅ Natural/Organic
- ✅ Ayurvedic
- ✅ Paraben-Free
- ✅ Sulphate-Free
- ✅ Fragrance-Free
- ✅ Silicone-Free
- ✅ Alcohol-Free
- ✅ Has SPF (with SPF value)
- ✅ Dermatologist Tested
- ✅ Hypoallergenic

---

## 🔮 Future Enhancements ##

- [ ] AI-based skin image analysis using computer vision
- [ ] Real-time product price synchronization across e-commerce platforms
- [ ] Personalized skincare routine recommendations
- [ ] Product wishlist and price alert notifications
- [ ] Skin progress tracking with image history
- [ ] Multi-language support (Hindi and other regional languages)
- [ ] Admin dashboard for product and content management
- [ ] Email notifications for skincare reminders
- [ ] Mobile application using React Native
- [ ] AI-powered chatbot for skincare guidance

---

## 🇮🇳 Made with ♥ in India

Skintellix is designed specifically for the Indian beauty consumer — celebrating all skin tones from fair to deep, supporting both budget and luxury segments, and integrating with India's most popular e-commerce platforms.
