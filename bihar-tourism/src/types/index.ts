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
  createdAt?: string;
  updatedAt?: string;
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
