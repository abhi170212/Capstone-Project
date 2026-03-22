import axios from 'axios';
import { Destination, Festival, EcoSite } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default api;
