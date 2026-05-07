# 🗓️ Trip Planner Documentation

The **Strategic Planner** is a powerful tool designed to help users architect their perfect Bihar journey. It provides a structured yet flexible environment to design day-by-day itineraries by injecting real tourist destinations into a temporal matrix.

---

## 🛠️ Key Functionalities

### 1. Timeline Management
- **Dynamic Days**: Users can expand their trip by adding new days or removing existing ones.
- **Auto-Sequencing**: The planner automatically handles day numbering and re-ordering if a middle day is removed.
- **Active Day Matrix**: A focused view that allows users to edit activities for one day at a time, preventing information overload.

### 2. Activity Matrix (`Day Matrix`)
- **Quick-Add Sidebar**: A searchable repository of all destinations. Users can "inject" any destination into their active day with a single click.
- **Time Categorization**: Each activity can be assigned a specific timeframe:
    - 🌅 **Morning**
    - ☀️ **Afternoon**
    - 🌆 **Evening**
    - 🌙 **Night**
- **Personalized Notes**: Users can write custom descriptions for each activity (e.g., "Must reach by 10 AM to avoid crowds").

### 3. Persistence & Export
- **Cloud Sync**: Integrated with the `itineraryApi`, allowing users to save their "Matrix" to their account.
- **Dashboard Integration**: Once saved, itineraries appear in the user's personal dashboard for future reference.

---

## 🏗️ Technical Architecture

### Component Structure
- **Sidebar**:
    - `Timeline`: Manages the list of days and active state.
    - `Quick Add`: Provides the destination catalog with search capabilities.
- **Main View**:
    - `Activity List`: A Framer Motion-powered list of all scheduled activities for the active day.

### Data Model
An itinerary consists of:
- `name`: A custom title for the trip.
- `days`: An array of day objects, each containing:
    - `day`: The sequence number.
    - `activities`: An array of objects with `destinationId`, `location`, `time`, and `description`.

### API Integration
- **GET**: Fetches all available destinations on mount.
- **POST**: Sends the final `ItineraryData` object to the backend for storage.

---

## 🎨 UI/UX Features
- **Motion UX**: Uses `AnimatePresence` for smooth entry/exit of activities.
- **Visual Feedback**: Real-time toast notifications for save/error actions.
- **Premium Aesthetics**: Features custom SVG patterns, glassmorphism headers, and a mobile-responsive "Snap" layout.
