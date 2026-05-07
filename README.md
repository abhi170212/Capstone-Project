# 🌟 Bihar Tourism Platform - Smart Digital Portal

A state-of-the-art, full-stack digital platform designed to showcase and manage the rich eco-tourism and cultural heritage of Bihar, India. This project integrates modern web technologies with immersive storytelling and strategic planning tools.

---

## 🚀 Project Overview

The Bihar Tourism Platform is a comprehensive ecosystem designed to transform the tourism experience in Bihar. It leverages a modern tech stack to provide travelers with high-performance discovery tools and administrators with total control over the platform's ecosystem.

### 🎯 Key Modules & Features

#### 🏠 Home Page - The Gateway
- **Cinematic Experience**: Automated background image slider and YouTube video integration.
- **Guided Onboarding**: Integrated `driver.js` tour that walks new users through the platform's features.
- **Dynamic Content**: Auto-featured destinations based on real-time traveler ratings (4.6+).
- **Immersive Animations**: Staggered scroll-reveal effects using `framer-motion`.

#### 🗺️ Destinations Hub - Catalog & Details
- **Smart Catalog**: Real-time search and category filtering (Eco vs. Cultural).
- **Rich Detail Views**: Comprehensive insights including entry fees, best seasons, and sustainability scores.
- **PDF Guide Generator**: Client-side PDF creation using `jsPDF` for offline traveler assistance.
- **Interactive Geospatial View**: Leaflet-powered maps with custom markers for every destination.

#### ✨ Smart Finder - AI-Inspired Discovery
- **4-Step Wizard**: Preference gathering for Travel Style, Budget, Season, and Interests.
- **Personalized Recommendations**: Intelligent mapping of user preferences to the most relevant tourism spots.
- **Community Inspiration**: Integrated traveler post feed to provide visual social proof.

#### 🗓️ Strategic Trip Planner - Itinerary Architect
- **Temporal Matrix**: Build day-by-day itineraries with granular time-slotting (Morning/Afternoon/Evening/Night).
- **Quick-Add System**: Searchable destination repository for rapid itinerary assembly.
- **Cloud Persistence**: Save and sync trip plans to the user's dashboard for multi-device access.

#### 📜 History & About - Heritage Narratives
- **2500+ Year Timeline**: A chronological deep-dive through 7 major historical eras.
- **Notable Personalities**: Biographical highlights of world-shaping figures from Bihar.
- **360° Panorama Matrix**: Virtual reality exploration of key Bihar landscapes.
- **Global Legacy Hub**: Documenting contributions to Mathematics, Science, and Religion.

#### 🛠️ Admin Panel - Mission Control
- **Real-time Analytics**: High-level tracking of users, reviews, and platform engagement.
- **CRUD Mission Control**: Full management of the destination database and image uploads.
- **RBAC & Moderation**: Multi-tier user roles (Admin, Co-admin, Guest) with content auditing tools.

---

## 🛠️ Technical Architecture

### Frontend (Next.js 14+ Architecture)
- **Framework**: Next.js App Router for optimized routing and server-side rendering benefits.
- **State Management**: Centralized `AuthContext` for session management and React hooks for local state.
- **Styling**: A hybrid of **Tailwind CSS** for layout and **Vanilla CSS** for premium aesthetic micro-details.
- **Animations**: Complex gesture and scroll-based animations powered by **Framer Motion**.

### Backend & API Services
- **Environment**: Node.js runtime with Express.
- **Data Layer**: Centralized `destinationApi` and `adminApi` services for consistent data flow.
- **Service Integration**: External weather APIs and geospatial data mapping.
- **Storage**: Image upload pipeline with automated path indexing.

---

## 📊 Data Matrix Structure

### Destination Object
```json
{
  "name": "Bodh Gaya",
  "type": "cultural",
  "location": "Gaya District",
  "rating": 4.9,
  "ecoScore": 95,
  "bestSeason": "October to March",
  "coordinates": { "lat": 24.6951, "lng": 84.9913 },
  "highlights": ["Mahabodhi Temple", "Bodhi Tree", "Great Buddha Statue"]
}
```

### Itinerary Object
```json
{
  "name": "Winter Spiritual Journey",
  "days": [
    {
      "day": 1,
      "activities": [
        { "time": "Morning", "location": "Nalanda", "description": "Explore the ancient ruins." }
      ]
    }
  ]
}
```

---

## 🛡️ Role-Based Access Control (RBAC)

| Role | Permissions | UI Indicator |
| :--- | :--- | :--- |
| **Admin** | Full system control, role escalation, global deletions. | ⭐⭐⭐ |
| **Co-Admin** | Moderation, destination updates, partial user management. | ⭐⭐ |
| **User** | Post content, build trip plans, save favorites. | - |
| **Guest** | Browse, limited interactions, account-less access. | ⭐ |

---

## 📁 Project Directory Map

```text
Capstone-Project/
├── bihar-tourism/         # Frontend Next.js Core
│   ├── src/app/           # Next.js App Router (Pages & API Routes)
│   ├── src/components/    # Specialized UI Components (Hero, Map, Gallery)
│   ├── src/context/       # Auth and Global State Providers
│   ├── src/lib/api/       # API Service Layer (Axios Interceptors)
│   └── src/types/         # TypeScript Interface Definitions
├── backend/               # Server-side logic & persistent storage
├── product-documentation/ # Detailed Technical & Feature Specs
│   ├── Home.md            # Landing experience documentation
│   ├── Destinations.md    # Catalog & Detailed view specs
│   ├── Trip-Planner.md    # Logic for day-by-day matrix
│   ├── Smart-Finder.md    # Recommendation engine wizard specs
│   ├── History.md         # Historical timeline & legacy data
│   └── Admin-Panel.md     # Workflows with Mermaid flowcharts
└── README.md              # Consolidated Platform Documentation
```

---

## ⚙️ Installation & Deployment

### 1. Prerequisite Checklist
- Node.js (v18.0 or higher)
- npm or yarn package manager
- Modern browser with WebGL support (for Maps/VR)

### 2. Implementation Steps

**Frontend Setup:**
```bash
cd bihar-tourism
npm install
npm run dev
```

**Backend Setup:**
```bash
cd backend
npm install
npm run dev
```

---

## 🎨 Design System

- **Beige/Cream** (`#FFF8EC`): Represents the ancient heritage and spiritual tranquility.
- **Forest Green** (`#546B41`): Reflects the state's lush forests and eco-tourism initiatives.
- **Sand/Tan** (`#DCCCAC`): Symbolizes the enduring stone and archaeological wonders.
- **Glassmorphism**: Semi-transparent overlays for modern, layered UI depth.

---

## 📈 Future Roadmap
- [ ] **Native Mobile App**: Cross-platform React Native companion app.
- [ ] **AI Concierge**: Generative AI chatbot for real-time travel planning.
- [ ] **Virtual Tours**: Enhanced AR/VR experiences for all 10+ major destinations.
- [ ] **Booking Integration**: Direct hotel and transportation booking APIs.

---

**Built with ❤️ by the Capstone Project Team for Bihar Tourism.**
*"Experience the land where civilization and enlightenment were born."*
