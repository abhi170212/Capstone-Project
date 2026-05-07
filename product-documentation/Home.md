# 🏠 Home Page Documentation

The Home Page serves as the primary gateway to the Bihar Tourism Platform, designed to provide an immersive and interactive introduction to the "Land of Enlightenment." It combines modern aesthetics with high-performance functionality to showcase Bihar's rich eco and cultural heritage.

---

## 🌟 Visual Overview

The Home page follows a curated color palette:
- **Beige/Cream** (`#FFF8EC`): Main background and warmth.
- **Light Green** (`#99AD7A`): Secondary sections and nature connection.
- **Sand/Tan** (`#DCCCAC`): Interactive elements and buttons.
- **Dark Green** (`#546B41`): Accents, borders, and typography.

---

## 🏗️ Core Sections

### 1. Hero Section (`HeroSection.tsx`)
The hero section is the first point of contact for users, featuring:
- **Dynamic Image Slider**: An automated background slider that cycles through 5 stunning images of Bihar's landscapes every 5 seconds.
- **Interactive Tour**: Integrated with `driver.js`, users can click "Learn to Use" to start a guided walkthrough of the platform's features.
- **Glassmorphism UI**: A semi-transparent central content box with backdrop blur, housing the primary value proposition and CTAs.
- **Scroll Indicator**: A subtle animation at the bottom encouraging users to explore further.

### 2. Featured Destinations
Displays top-rated destinations based on real-time data:
- **Logic**: Automatically filters and displays destinations with a rating of **4.6 or higher**.
- **UI**: Uses a responsive grid of `DestinationCard` components with hover animations.
- **Loading State**: Includes a custom-styled spinner matching the theme.

### 3. Experience Section (About)
A statistics-driven section that highlights the scale of tourism in Bihar:
- **Quick Stats**: Showcases 10+ destinations and 2 primary categories (Eco & Cultural).
- **Engaging Copy**: Focuses on the spiritual and natural significance of Bihar.

### 4. Interactive Map (`MapComponent.tsx`)
A full-width interactive map powered by **Leaflet** and **OpenStreetMap**:
- **Markers**: Pins all available destinations on the map.
- **Engagement**: Allows users to geographically explore tourist spots before diving into details.

### 5. Image Gallery (`ImageGallery.tsx`)
A curated selection of images extracted from the destination database, providing a visual feast of the state's beauty.

### 6. Call-to-Action (CTA)
A final section encouraging users to reach out via the contact page to plan their journey.

---

## 🛠️ Technical Implementation

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **State Management**: React `useState` and `useEffect` for fetching and storing destination data.
- **Animations**: `framer-motion` for scroll-triggered entry animations and smooth transitions.
- **Data Fetching**: `axios` via a centralized `destinationApi` layer.
- **Guided Tour**: `driver.js` for the interactive onboarding experience.

### File Structure
- **Page File**: `src/app/page.tsx`
- **Main Components**:
  - `src/components/HeroSection.tsx`
  - `src/components/DestinationCard.tsx`
  - `src/components/MapComponent.tsx`
  - `src/components/ImageGallery.tsx`

---

## 📊 Data Flow
1. **Fetch**: On mount, the page calls `destinationApi.getAll()`.
2. **Filter**: The data is processed to extract `featuredDestinations` (Rating >= 4.6).
3. **Distribute**: 
   - All destinations are passed to the `MapComponent`.
   - Featured ones go to the `DestinationCard` grid.
   - Images are flattened for the `ImageGallery`.

---

## 🔗 Navigation Links
- **Explore Destinations**: Links to `/destinations`
- **Learn More**: Links to `/about`
- **Contact Us**: Links to `/contact`
