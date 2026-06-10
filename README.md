<div align="center">

# Y&I Villa — AI-Powered Hotel Review Management System
### Hotel logo
![Hotel Logo](docs/screenshots/Y&I.png)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

**A full-stack intelligent hotel management platform that combines a modern web application with a multi-stage AI/ML pipeline to automatically analyze guest reviews, detect complaints, and generate actionable management recommendations.**

</div>

---

## Screenshots

### Home Page
![Y&I Villa Home Page](docs/screenshots/01_home.png)

### AI Intelligence Dashboard
![AI Analytics Dashboard](docs/screenshots/02_ai_dashboard.png)

### AI Actionable Recommendations 
![AI Recommendations](docs/screenshots/03_ai_recommendations.png)

---

## 📋 Overview

**Y&I Villa** is a boutique hotel management system built as a university software engineering + AI/ML project. The system handles the complete hotel workflow — from customer registration and room booking, through review submission, to automated AI-powered complaint analysis and management reporting.

The project is divided into two tightly integrated parts:

| Part | Technology | Purpose |
|------|-----------|---------|
| `SE_part` | Node.js + React (MERN-style) | Web application & REST API |
| `AIML_part` | Python (scikit-learn + Gemini AI) | ML pipeline & AI recommendation engine |

When a guest submits a review, the Node.js backend automatically triggers the Python AI pipeline as a **child process**, which runs sentiment analysis, category classification, K-Means complaint clustering, and finally calls the **Google Gemini 2.5 Flash** API to generate a structured, actionable recommendation — all without any manual admin intervention.

---

## 🎯 Project Objectives

- ✅ Build a complete hotel management web application with role-based access control
- ✅ Implement automated NLP-based sentiment analysis on guest reviews
- ✅ Classify complaints into meaningful categories (Rooms, Staff, Food, Other)
- ✅ Use unsupervised K-Means clustering to identify specific recurring complaint patterns
- ✅ Integrate Google Gemini AI to generate structured, management-ready recommendations
- ✅ Provide an admin analytics dashboard with real-time charts and KPIs
- ✅ Enable a full booking management workflow with approval/rejection

---

## Features

### Public-Facing Features
- Beautiful landing page with villa overview and room listings
- Public display of approved guest reviews
- Contact page
- Customer registration and login

### Customer Portal
- Personal dashboard showing bookings and reviews
- Room booking with check-in/out date selection and special requests
- Submit reviews with star ratings
- View AI analysis results on own submitted reviews

### Admin Panel
- **Main Dashboard** — Live KPIs: total customers, active bookings, pending reviews, occupancy rate
- **AI Intelligence Dashboard** — Interactive charts: sentiment pie chart, monthly trend line chart, complaint category donut chart, cluster ranking bar chart, top issue alert, AI recommendation table
- **Review Management** — Approve or delete reviews, view AI-generated sentiment and category
- **Booking Management** — Approve or reject customer bookings
- **Customer Management** — View and delete customer accounts

### AI/ML Engine
- **Sentiment Analysis** — Logistic Regression model (Positive / Negative)
- **Category Classification** — Multi-class classifier (Rooms / Staff / Food / Other)
- **K-Means Complaint Clustering** — Groups negative reviews into 4 specific complaint clusters per category (16 clusters total)
- **Google Gemini Integration** — Generates structured 3-part recommendations (Root Cause, Actions, Priority Level)
- **Auto-triggered Pipeline** — Node.js spawns the Python pipeline on every review submission

---

## System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER / BROWSER                          │
└─────────────────────────┬──────────────────────────────────────────┘
                          │ HTTP (React SPA)
┌─────────────────────────▼──────────────────────────────────────────┐
│                    FRONTEND  (React + Vite)                        │
│  Public Pages │ Customer Dashboard │ Admin Panel + AI Dashboard    │
└─────────────────────────┬──────────────────────────────────────────┘
                          │ REST API (Axios)
┌─────────────────────────▼──────────────────────────────────────────┐
│                  BACKEND  (Node.js + Express)                      │
│  /api/auth  │  /api/reviews  │  /api/bookings  │  /api/analytics   │
│                     JWT Auth + bcrypt                              │
└────────┬────────────────┬──────────────────────────────────────────┘
         │                │ child_process.spawn()
         │         ┌──────▼────────────────────────────────────────┐
         │         │        PYTHON AI PIPELINE                     │
         │         │  Clean → Sentiment → Category → Cluster       │
         │         │       → Gemini AI → MongoDB Update            │
         │         └──────┬────────────────────────────────────────┘
         │                │
┌────────▼────────────────▼──────────────────────────────────────────┐
│                      MongoDB Atlas                                 │
│         Users  │  Bookings  │  Reviews (+ AI results)              │
└────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | SPA framework & build tool |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Recharts | Interactive charts (Pie, Bar, Line) |
| Axios | HTTP client for API calls |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens (JWT) | Stateless authentication |
| bcryptjs | Password hashing |
| child_process (spawn) | Triggers Python pipeline |

### AI / ML
| Technology | Purpose |
|-----------|---------|
| scikit-learn | Logistic Regression, K-Means, TF-IDF |
| NLTK | Stopword removal & lemmatization |
| pandas | Data processing |
| joblib | Model serialization (.pkl files) |
| Google Gemini 2.5 Flash | AI recommendation generation |
| PyMongo | Python → MongoDB connection |

---

## 🤖 AI Workflow

When a customer submits a review, the following 7-step pipeline runs automatically:

```
 STEP 1  │  Text Cleaning
         │  Lowercase, remove punctuation, stopwords, lemmatize
         ▼
 STEP 2  │  Sentiment Classification  (Logistic Regression)
         │  → Positive  ──────────────────────────────────────────► Save "Great review!" ✅
         │  → Negative  ──────────────────────────────────────────► Continue to Step 3
         ▼
 STEP 3  │  Category Classification  (Multi-class Logistic Regression)
         │  → Rooms / Staff / Food / Other
         ▼
 STEP 4  │  Complaint Clustering  (K-Means, 4 clusters per category)
         │  → Cluster ID: 0, 1, 2, or 3
         ▼
 STEP 5  │  Cluster → Human Label Mapping  (config/settings.py)
         │  → e.g., "Room Facilities & Bathroom Issues"
         ▼
 STEP 6  │  Gemini AI Prompt  (ai_engine/prompt_builder.py)
         │  → Root Cause + 3 Actionable Solutions + Priority Level
         ▼
 STEP 7  │  MongoDB Update  (database/mongodb.py)
         │  → Review document updated with all AI analysis results
```

### ML Model Training Pipeline (Offline — Steps 1–6)

| Script | Description |
|--------|-------------|
| `step1_master_dataset.py` | Collect and merge raw hotel review datasets |
| `step2_preprocessing.py` | Clean and normalize text |
| `step3_feature_engineering.py` | TF-IDF feature extraction |
| `step4_sentiment_model.py` | Train and compare 3 Logistic Regression models (GridSearchCV) |
| `step5_train_category_model.py` | Train multi-class category classifier |
| `step6_kmeans_clustering.py` | Train K-Means models per complaint category |

### Trained Models (Saved as `.pkl`)
- `sentiment_model.pkl` — Positive / Negative classifier
- `category_model.pkl` — Rooms / Staff / Food / Other classifier
- `kmeans_rooms.pkl`, `kmeans_staff.pkl`, `kmeans_food.pkl`, `kmeans_other.pkl` — Complaint cluster models

---

## Installation

### Prerequisites
- Node.js v18+
- Python 3.10+
- MongoDB Atlas 
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone https://github.com/Mendis1215/AI-Hotel-Review-Management-System.git
cd AI-Hotel-Review-Management-System
```

### 2. Backend Setup
```bash
cd SE_part/backend
npm install
```

Create `.env` file in `SE_part/backend/`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Seed the admin account:
```bash
node seedAdmin.js
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd SE_part/frontend
npm install
npm run dev
```

The frontend will be available at: **http://localhost:5173**

### 4. Python AI Engine Setup
```bash
cd AIML_part
pip install -r requirements.txt
```

Create `.env` file in `AIML_part/`:
```env
GEMINI_API_KEY=your_google_gemini_api_key
MONGO_URI=your_mongodb_connection_string
```

> The Python pipeline is triggered **automatically** by the Node.js backend when a review is submitted. No manual start required.

---

## Environment Variables

### `SE_part/backend/.env`
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/yivilla` |
| `JWT_SECRET` | Secret key for JWT signing | `mysupersecretkey123` |
| `PORT` | Backend server port | `5000` |

### `AIML_part/.env`
| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `MONGO_URI` | MongoDB connection string (same as backend) | `mongodb+srv://...` |

---

## 📁 Project Structure

```
Y&I_Villa/
│
├── 📁 SE_part/                         # Web Application
│   │
│   ├── 📁 backend/                     # Node.js + Express REST API
│   │   ├── 📁 config/
│   │   │   └── db.js                   # MongoDB connection
│   │   ├── 📁 controllers/
│   │   │   ├── authController.js       # Register, login, user management
│   │   │   ├── bookingController.js    # Create & manage bookings
│   │   │   ├── reviewController.js     # Submit reviews, trigger Python AI
│   │   │   └── analyticsController.js  # KPI & AI analytics data
│   │   ├── 📁 middleware/
│   │   │   └── authMiddleware.js       # JWT protect & admin guard
│   │   ├── 📁 models/
│   │   │   ├── User.js                 # User schema (bcrypt hashing)
│   │   │   ├── Booking.js              # Booking schema
│   │   │   └── Review.js               # Review schema (+ AI result fields)
│   │   ├── 📁 routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   └── analyticsRoutes.js
│   │   ├── server.js                   # Express app entry point
│   │   └── seedAdmin.js                # Admin account seeder
│   │
│   └── 📁 frontend/                    # React + Vite SPA
│       └── 📁 src/
│           ├── 📁 context/
│           │   └── AuthContext.jsx     # Global auth state (JWT storage)
│           ├── 📁 components/layout/
│           │   ├── Navbar.jsx
│           │   └── Footer.jsx
│           ├── 📁 pages/
│           │   ├── 📁 public/          # Home, Rooms, About, Login, Register
│           │   ├── 📁 customer/        # Dashboard, Booking, SubmitReview
│           │   └── 📁 admin/           # AdminDashboard, AIAnalyticsDashboard,
│           │                           # ReviewMgmt, BookingMgmt, CustomerMgmt
│           └── App.jsx                 # Route definitions + ProtectedRoute
│
├── 📁 AIML_part/                       # Python AI/ML Engine
│   ├── 📁 ai_engine/
│   │   ├── gemini_service.py           # Google Gemini API integration
│   │   └── prompt_builder.py           # Structured prompt builder
│   ├── 📁 config/
│   │   └── settings.py                 # Cluster label mappings
│   ├── 📁 database/
│   │   └── mongodb.py                  # PyMongo connection & update helper
│   ├── 📁 models/                      # Trained ML models (.pkl files)
│   ├── 📁 pipeline/
│   │   └── review_pipeline.py          # Live 7-step review processing
│   ├── 📁 data/                        # Raw & processed datasets
│   ├── 📁 Reports/                     # Training reports & figures
│   ├── step1_master_dataset.py
│   ├── step2_preprocessing.py
│   ├── step3_feature_engineering.py
│   ├── step4_sentiment_model.py
│   ├── step5_train_category_model.py
│   ├── step6_kmeans_clustering.py
│   └── run_pipeline.py                 # Run full training pipeline
│
├── 📁 docs/
│   └── 📁 screenshots/                 # Project screenshots
├── .gitignore
└── README.md
```

---

## User Roles

| Role | Access Level | Key Abilities |
|------|-------------|---------------|
| **Public Visitor** | No login required | Browse pages, view approved reviews |
| **Customer** | Login required | Book rooms, submit reviews, view personal dashboard |
| **Admin** | Staff login required | Full admin panel, AI analytics, manage all bookings/reviews/customers |


## Future Enhancements

### Room Availability Tracking

### Advanced Analytics

### Email Notifications

### Additional Improvements
- **Real-time Updates** — WebSocket integration so admin sees new reviews without page refresh
- **Mobile App** — React Native companion app for hotel staff
- **Multi-property Support** — Extend the platform to manage multiple hotel properties
- **Payment Integration** — Online room deposit payment via Stripe or PayPal
- **Review Response System** — Allow admin to reply publicly to guest reviews

---

## 👨‍💻 Author

**Menuri Mendis** — SLIIT University, Sri Lanka

---

<div align="center">
  <p>Y&I Villa</p>
</div>
