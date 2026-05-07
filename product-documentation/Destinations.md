# 🗺️ Destinations Documentation

The Destinations module is the core of the Bihar Tourism Platform, providing a comprehensive catalog of tourist spots and detailed insights into each location. It is split into two primary views: the **Listing Page** and the **Detail Page**.

---

## 🔍 Destinations Listing Page (`/destinations`)

The listing page allows users to browse, search, and filter the full catalog of Bihar's tourism offerings.

### Key Features
- **Dynamic Search**: Real-time filtering based on destination name or location.
- **Category Filtering**: Allows users to toggle between `Eco`, `Cultural`, or `All` destination types.
- **Results Tracking**: Displays the count of matching destinations and provides a "Clear filters" utility.
- **Interactive Map Preview**: A dedicated map section at the bottom showing all destinations globally across the state.
- **Responsive Layout**: On mobile, destinations are presented in a horizontal scrollable "snap" layout for better touch interaction; on desktop, they transition to a multi-column grid.

### Logic & Data Flow
1. **Initial Load**: Fetches all destinations from the backend via `destinationApi.getAll()`.
2. **Client-side Filtering**: Uses React state (`searchQuery`, `categoryFilter`) to filter the array in real-time without additional API calls.
3. **Empty States**: Includes custom SVG illustrations and "Retry" mechanisms for failed loads or no results.

---

## 🏛️ Destination Detail Page (`/destinations/[id]`)

A rich, interactive deep-dive into a specific tourist spot, designed to convert interest into action (booking/planning).

### Visual & Interactive Components
- **Immersive Hero Header**: High-quality destination imagery with a glassmorphism overlay containing key actions (Save, Share, PDF Download).
- **Traveler Experience Hub**:
    - **Reviews Section**: Authenticated users can leave star ratings and comments.
    - **Community Feed**: Pulls real traveler posts from the "Smart Finder" community relating to the specific location.
- **Utilities & Widgets**:
    - **Weather Widget**: Real-time weather data based on the destination's coordinates.
    - **Nearby Attractions**: Automatically identifies other tourist spots within a 100km radius.
    - **PDF Guide Generator**: Client-side PDF generation using `jsPDF`, allowing users to download an offline travel guide.
- **Trip Essentials Sidebar**: Displays "Best Time to Visit," "Entry Fee," and "Sustainability/Budget" choices.

### Conversion Actions
- **Booking System**: Integrated `BookingForm` modal for instant reservations.
- **Trip Planner**: One-click addition to the user's personal itinerary via `/trip-planner`.
- **Save to Favorites**: Heart-toggle functionality with real-time feedback via `react-hot-toast`.

---

## 🛠️ Technical Deep Dive

### Components Used
- `DestinationCard`: Standardized card for the listing grid.
- `SearchBar`: Specialized input and filter toggle component.
- `WeatherWidget`: External API integration for local conditions.
- `NearbyAttractions`: Geospatial proximity component.
- `MapComponent`: Leaflet/OpenStreetMap integration.

### Libraries & APIs
- **PDF Generation**: `jsPDF` for generating on-the-fly destination guides.
- **Icons**: `lucide-react` for a modern, consistent iconography.
- **State & Context**: Uses `AuthContext` to manage favorites and review submissions.
- **Feedback**: `react-hot-toast` for non-intrusive user notifications.

---

## 📊 Technical Data Structure
The destination object includes:
- `name`, `location`, `description`
- `coordinates`: `{ lat, lng }`
- `type`: `eco` | `cultural`
- `rating` & `ecoScore`
- `images`: Array of high-res URLs.
- `activities` & `interests`: Arrays for tagging and highlights.
- `bestSeason` & `entryFee`: Strings for traveler information.
