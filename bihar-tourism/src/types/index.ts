export interface Destination {
  _id: string;
  name: string;
  description: string;
  location: string;
  type: 'eco' | 'cultural' | 'historical';
  images: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  bestSeason: string;
  entryFee: string;
  ecoScore: number;
  interests: string[];
  budget: 'Budget' | 'Mid-range' | 'Luxury';
  activities: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Itinerary {
  _id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  days: {
    day: number;
    activities: {
      time?: string;
      location?: string;
      description?: string;
      destinationId?: Destination;
    }[];
  }[];
  totalBudget?: number;
  createdAt?: string;
}

export interface Festival {
  _id: string;
  name: string;
  location: string;
  month: string;
  description: string;
  images: string[];
}

export interface EcoSite {
  _id: string;
  name: string;
  wildlife: string[];
  ecoActivities: string[];
  parkType: string;
  location: string;
  images: string[];
}
