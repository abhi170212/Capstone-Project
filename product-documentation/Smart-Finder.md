# ✨ Smart Finder Documentation

The **Smart Finder** is an intelligent discovery engine that replaces traditional search with a guided, preference-based experience. It uses a 4-step wizard to map user personality and constraints to the most relevant destinations in Bihar.

---

## 🧭 The Discovery Wizard

The user experience is divided into four distinct phases of preference gathering:

### Step 1: Travel Style
Focuses on the core objective of the trip:
- **Eco Tourism**: For nature and wildlife enthusiasts.
- **Cultural Tourism**: For those seeking heritage and history.
- **Religious**: For spiritual journeys and pilgrimages.

### Step 2: Budget Allocation
Sets the financial boundaries:
- **Budget**: Focuses on accessible, low-cost destinations.
- **Mid-range**: A balance of comfort and experience.
- **Luxury**: Premium stays and exclusive heritage experiences.

### Step 3: Seasonal Context
Aligns the trip with Bihar's climate:
- Options: **Spring, Summer, Monsoon, Autumn, Winter**.
- *Note*: Recommendations change based on seasonal accessibility (e.g., wildlife sanctuaries in monsoon).

### Step 4: Personal Interests
A multi-select step for fine-tuning the results:
- Options include: **Wildlife, History, Nature, Festivals, Architecture, Spiritual**.

---

## 🧠 Recommendation Engine

### Logic Flow
1. **Preference Collection**: User selections are stored in a local state.
2. **API Request**: On the final step, a request is sent to `recommendationApi.get()` with the full preference payload.
3. **Matching**: The backend (or recommendation layer) filters the destination database to find the highest match score based on the input categories.
4. **Display**: Results are presented in a high-impact horizontal "snap" grid.

---

## 📸 Community Inspiration

The Smart Finder doesn't just show technical data; it integrates **Authentic Traveler Inspirations**:
- **Real Photos**: Displays recent posts from the community.
- **Social Context**: Users can see what other travelers are currently experiencing at recommended locations.
- **Visual Validation**: Helps users "see" themselves in the destination before committing.

---

## 🛠️ Technical Implementation

### Key Components
- **Step Renderer**: A state-driven switch case that manages the wizard flow.
- **Progress Bar**: A visual indicator of the user's journey through the 4 steps.
- **Info Modal**: An onboarding overlay explaining the "How-To" for new users.
- **AnimatePresence**: Ensures smooth, sliding transitions between wizard steps.

### Integration Layer
- `recommendationApi`: Centralized API calls for personalized results.
- `AuthContext`: Used to personalize the community feed and handle interactions with posts.
- `PostCard`: Reusable component for displaying traveler stories.

---

## 🎨 UI/UX Design
- **Interactive Buttons**: Large, accessible tiles for touch and mouse interaction.
- **Wizard Navigation**: Includes "Back" functionality at every step to allow users to refine their choices.
- **State Handling**: Beautifully designed loading spinners and "No Results" states with clear calls to action.
