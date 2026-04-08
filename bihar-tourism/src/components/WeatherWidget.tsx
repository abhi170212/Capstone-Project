'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { weatherApi } from '@/lib/api';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, Thermometer, AlertCircle } from 'lucide-react';

interface WeatherWidgetProps {
  lat: number;
  lng: number;
  location?: string;
}

export default function WeatherWidget({ lat, lng, location }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await weatherApi.getCurrent(lat, lng);
        setWeather(res.data);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        setError('Unable to load weather data');
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [lat, lng]);

  const getWeatherIcon = (icon: string, size: number = 24) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'sunny': <Sun size={size} className="text-yellow-500" />,
      'partly-cloudy': <Cloud size={size} className="text-gray-500" />,
      'cloudy': <Cloud size={size} className="text-gray-600" />,
      'rainy': <CloudRain size={size} className="text-blue-500" />,
    };
    return iconMap[icon] || <Sun size={size} className="text-yellow-500" />;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white animate-pulse">
        <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
        <div className="h-12 bg-white/20 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-white/20 rounded w-full"></div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-gray-100 rounded-2xl p-6 text-center">
        <AlertCircle size={32} className="mx-auto text-gray-400 mb-2" />
        <p className="text-gray-600 text-sm">Weather data unavailable</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Current Weather */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-blue-100 text-sm mb-1">
              {location || 'Current Location'}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-5xl font-bold">{weather.current.temp}°C</span>
              {getWeatherIcon(weather.current.icon, 48)}
            </div>
          </div>
        </div>
        
        <p className="text-blue-50 text-lg capitalize mb-4">
          {weather.current.description}
        </p>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Thermometer size={18} />
            <div>
              <p className="text-xs text-blue-100">Feels Like</p>
              <p className="font-semibold">{weather.current.feels_like}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets size={18} />
            <div>
              <p className="text-xs text-blue-100">Humidity</p>
              <p className="font-semibold">{weather.current.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind size={18} />
            <div>
              <p className="text-xs text-blue-100">Wind</p>
              <p className="font-semibold">{weather.current.wind_speed} km/h</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-800 mb-3">7-Day Forecast</h4>
        <div className="space-y-2">
          {weather.forecast.map((day: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 w-20">{day.day}</span>
              <div className="flex items-center gap-2 flex-1 justify-center">
                {getWeatherIcon(day.icon, 20)}
                <span className="text-xs text-gray-500 capitalize hidden sm:inline">{day.description}</span>
              </div>
              <span className="text-sm font-bold text-gray-800 w-12 text-right">{day.temp}°C</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {weather.recommendation && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-100">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Sun size={20} className="text-green-600" />
            Travel Tips
          </h4>
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Best time:</span> {weather.recommendation.bestTimeToVisit}
            </p>
            <ul className="space-y-1">
              {weather.recommendation.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
}
