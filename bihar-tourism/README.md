# 🌟 Smart Digital Platform for Eco & Cultural Tourism in Bihar

A modern, full-featured tourism website showcasing the rich eco and cultural heritage of Bihar, India. Built with Next.js 14+, Tailwind CSS, and Framer Motion.

![Bihar Tourism](https://img.shields.io/badge/Bihar-Tourism-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan?style=for-the-badge&logo=tailwind-css)

---

## 📍 Features

### ✨ Core Functionality
- **6 Complete Pages**: Home, Destinations, Eco Tourism, Cultural, About, Contact
- **Interactive Maps**: Leaflet/OpenStreetMap integration showing all tourist spots
- **Search & Filter**: Real-time destination search with category filtering
- **Responsive Design**: Mobile-first, works on all devices
- **Smooth Animations**: Beautiful transitions using Framer Motion
- **Modern UI**: Clean, professional tourism interface

### 🎯 Key Components
- ✅ Responsive Navbar with mobile menu
- ✅ Beautiful Hero Sections with animations
- ✅ Destination Cards with ratings and highlights
- ✅ Interactive Map Preview
- ✅ Search Bar with filters
- ✅ Image Gallery
- ✅ Contact Form
- ✅ Comprehensive Footer

### 🗺️ 10 Tourist Destinations
**Eco Tourism:**
- Valmiki Tiger Reserve
- Kanha Wildlife Sanctuary
- Bhimbandh Wildlife Sanctuary
- Kaimur Wildlife Sanctuary

**Cultural Tourism:**
- Bodh Gaya
- Nalanda University Ruins
- Vikramshila University
- Patna Sahib Gurudwara
- Vaishali

**Both Categories:**
- Rajgir

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Navigate to the project directory**
```bash
cd bihar-tourism
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open browser**
Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
bihar-tourism/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Home page
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Global styles
│   │   ├── destinations/        # All destinations page
│   │   ├── eco-tourism/         # Eco tourism page
│   │   ├── cultural/            # Cultural tourism page
│   │   ├── about/               # About page
│   │   └── contact/             # Contact page
│   ├── components/              # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── DestinationCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── MapComponent.tsx
│   │   ├── HeroSection.tsx
│   │   └── ImageGallery.tsx
│   └── data/
│       └── destinations.ts      # Tourism data
├── public/                      # Static assets
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React Framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS framework |
| **Framer Motion** | Animation library |
| **React-Leaflet** | Interactive maps |
| **Axios** | HTTP client (ready for API) |

---

## 🎨 Design Features

### Color Palette
- **Primary Green**: `#16a34a` - Represents eco-tourism and nature
- **Primary Blue**: `#2563eb` - Represents cultural heritage
- **Gradients**: Green to Blue transitions symbolizing harmony between nature and culture

### Typography
- Modern sans-serif fonts for clean readability
- Responsive font sizes
- Bold headings for emphasis

### UI Elements
- Rounded corners for friendly appearance
- Shadow effects for depth
- Gradient backgrounds for visual appeal
- Hover animations for interactivity

---

## 📱 Responsive Design

The website is fully responsive and optimized for:
- 📱 **Mobile** (< 640px)
- 📱 **Tablet** (640px - 1024px)
- 💻 **Desktop** (> 1024px)

Features include:
- Collapsible mobile navigation
- Touch-friendly buttons
- Optimized image sizes
- Flexible grid layouts

---

## 🗺️ Map Integration

Interactive maps powered by **Leaflet** and **OpenStreetMap**:
- Display all tourist destinations
- Clickable markers with popups
- Auto-centering on destination clusters
- Zoom controls
- Multiple map views across different pages

---

## 🔍 Search & Filter

Advanced filtering capabilities:
- **Text Search**: Search by destination name or location
- **Category Filter**: Filter by Eco, Cultural, or All
- **Real-time Results**: Instant filtering as you type
- **Active Filters Display**: See current filters at a glance
- **Clear All**: One-click filter reset

---

## 📊 Performance

- ⚡ Fast page loads with Next.js optimization
- 🎯 Efficient component rendering
- 📦 Optimized images and assets
- 🔄 Smooth animations without lag

---

## 🌐 Pages Overview

### 1. Home Page (`/`)
- Stunning hero banner
- Featured destinations showcase
- Interactive map preview
- Call-to-action sections
- Image gallery

### 2. Destinations Page (`/destinations`)
- Complete listing of all 10 destinations
- Search and filter functionality
- Grid layout with cards
- Interactive map view

### 3. Eco Tourism Page (`/eco-tourism`)
- Dedicated to nature-based tourism
- Wildlife sanctuaries focus
- Statistics and highlights
- Filtered destination list

### 4. Cultural Tourism Page (`/cultural`)
- Heritage and historical sites
- Ancient universities feature
- Timeline of significant events
- Sacred pilgrimage destinations

### 5. About Page (`/about`)
- Comprehensive information about Bihar
- Mission statement
- Key features showcase
- Photo gallery

### 6. Contact Page (`/contact`)
- Working contact form
- Contact information cards
- Emergency contacts
- Office location map

---

## 🎯 Future Enhancements

Potential additions for production deployment:

- [ ] Backend API integration
- [ ] User authentication system
- [ ] Hotel/accommodation booking
- [ ] Transportation booking
- [ ] User reviews and ratings
- [ ] Advanced map features (routes, directions)
- [ ] Multi-language support (Hindi, English)
- [ ] Weather integration
- [ ] Event calendar
- [ ] Travel blog section
- [ ] Admin dashboard
- [ ] Payment gateway integration
- [ ] Social media integration

---

## 🤝 Contributing

This is a capstone project demonstrating modern web development skills. For educational purposes.

---

## 📄 License

Educational/Capstone Project - Built for demonstrating full-stack development capabilities.

---

## 👨‍💻 Developer

Built as part of the **Qoder Automation Framework** capstone project.

**Tech Skills Demonstrated:**
- Modern React/Next.js development
- Component-based architecture
- Responsive web design
- TypeScript implementation
- State management
- API-ready structure
- Animation implementation
- Map integration

---

## 📞 Contact Information

**Bihar Tourism Department** (Sample Data)
- Address: Patna, Bihar 800001, India
- Email: info@bihartourism.gov.in
- Phone: +91 612 2222222
- Emergency Helpline: 1363 (Tourist Helpline)

---

## 🙏 Acknowledgments

- Images from Unsplash (placeholder URLs)
- OpenStreetMap contributors
- Leaflet.js team
- Next.js team
- Tailwind CSS team

---

**Built with ❤️ for promoting Eco & Cultural Tourism in Bihar**

*"Experience the land where Lord Buddha attained enlightenment"*
