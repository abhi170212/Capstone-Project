# 🌟 Bihar Tourism Platform - Smart Digital Portal

A state-of-the-art, full-stack digital platform designed to showcase and manage the rich eco-tourism and cultural heritage of Bihar, India. This project integrates modern web technologies with immersive storytelling and strategic planning tools.

---

## 🚀 Project Overview

The Bihar Tourism Platform is more than just a website; it's a comprehensive ecosystem for travelers and administrators. It features a cinematic frontend, an intelligent recommendation engine, a strategic trip planner, and a robust administrative control center.

### 🎯 Key Modules

| Module | Purpose | Key Features |
| :--- | :--- | :--- |
| **🏠 Home Page** | Gateway & Onboarding | Cinematic Hero, Interactive Tour (`driver.js`), Featured Grid. |
| **🗺️ Destinations** | Exploration Hub | Search/Filter, Interactive Maps, PDF Guide Generator. |
| **✨ Smart Finder** | AI-Driven Discovery | 4-step Preference Wizard, Personalized Recommendations. |
| **🗓️ Trip Planner** | Strategic Itineraries | Day-by-Day Activity Matrix, Time Slotting, Dashboard Saving. |
| **📜 History & About** | Heritage Storytelling | 2500+ Year Timeline, 360° Panorama Viewer, Video Masking. |
| **🛠️ Admin Panel** | Platform Control | Analytics Dashboard, Role-Based Access (RBAC), Content Moderation. |

---

## 🛠️ Tech Stack

### Frontend (Next.js 14+)
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animations**: Framer Motion
- **Interactivity**: Driver.js (Tours), Leaflet (Maps)
- **State Management**: React Context & Hooks

### Backend & API
- **Runtime**: Node.js
- **API Client**: Axios with centralized request interceptors
- **Authentication**: JWT-based secure auth (via `AuthContext`)
- **PDF Generation**: jsPDF for on-the-fly travel guides

---

## 📁 Project Architecture

The project is organized as a full-stack monorepo:

```text
Capstone-Project/
├── bihar-tourism/         # Frontend Next.js Application
│   ├── src/app/           # App Router Pages (Home, Destinations, etc.)
│   ├── src/components/    # Reusable UI components
│   └── src/lib/api/       # Centralized API service layer
├── backend/               # Server-side logic and API endpoints
├── product-documentation/ # Detailed technical & functional docs
│   ├── Home.md            # Home page deep-dive
│   ├── Destinations.md    # Catalog & Detail view docs
│   ├── Trip-Planner.md    # Itinerary builder logic
│   ├── Smart-Finder.md    # Recommendation engine docs
│   ├── History.md         # 2500-year timeline documentation
│   └── Admin-Panel.md     # Control center workflows & charts
└── README.md              # Root project documentation (You are here)
```

---

## ⚙️ Installation & Setup

### 1. Frontend Setup
```bash
cd bihar-tourism
npm install
npm run dev
```
The frontend will be available at `http://localhost:3000`.

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend services will be available at `http://localhost:5000` (default).

---

## 📖 Extended Documentation

For in-depth analysis of specific modules, please refer to the files in the `product-documentation` folder:

- [🏠 Home Page Guide](./product-documentation/Home.md)
- [🗺️ Destinations & Details](./product-documentation/Destinations.md)
- [🗓️ Strategic Trip Planner](./product-documentation/Trip-Planner.md)
- [✨ Smart Finder Engine](./product-documentation/Smart-Finder.md)
- [📜 Historical Timeline](./product-documentation/History.md)
- [🛠️ Admin Mission Control](./product-documentation/Admin-Panel.md)

---

## 🎨 Design Philosophy
The platform follows a **"Nature & Heritage"** aesthetic:
- **Beige/Cream** (`#FFF8EC`): Represents the warmth and ancient dust of the land.
- **Forest Green** (`#546B41`): Symbolizes the rich eco-tourism and forests.
- **Sand/Tan** (`#DCCCAC`): Reflects the historical monuments and structures.

---

**Built with ❤️ as part of the Capstone Project for Bihar Tourism.**
*"Experience the land where enlightenment was found."*
