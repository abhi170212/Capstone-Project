import axios from 'axios';
import { Destination, Festival, EcoSite } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        try {
          const parsed = JSON.parse(userInfo);
          if (parsed.token) {
            config.headers.Authorization = `Bearer ${parsed.token}`;
          }
        } catch (e) {
          console.error("Error parsing user info", e);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const destinationApi = {
  getAll: async (params?: { type?: string }) => {
    const response = await api.get<{ success: boolean; count: number; data: Destination[] }>('/destinations', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Destination }>(`/destinations/${id}`);
    return response.data;
  },
  getCultural: async () => {
    const response = await api.get<{ success: boolean; count: number; data: Destination[] }>('/cultural');
    return response.data;
  },
};

export const ecoApi = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; count: number; data: EcoSite[] }>('/ecotourism');
    return response.data;
  },
};

export const festivalApi = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; count: number; data: Festival[] }>('/festivals');
    return response.data;
  },
};

export const recommendationApi = {
  get: async (params: { travelType?: string; budget?: string; season?: string; interests?: string[] }) => {
    const response = await api.get<{ success: boolean; count: number; data: Destination[] }>('/recommendations', { params });
    return response.data;
  },
};

export interface ItineraryData {
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
      destinationId?: string;
    }[];
  }[];
  totalBudget?: number;
}

export const itineraryApi = {
  create: async (data: ItineraryData) => {
    const response = await api.post<{ success: boolean; data: any }>('/itineraries', data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get<{ success: boolean; count: number; data: any[] }>('/itineraries');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: any }>(`/itineraries/${id}`);
    return response.data;
  },
};

export default api;
