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
      <div className="bg-[#99AD7A] border border-[#546B41] rounded-3xl p-6 text-black animate-pulse shadow-none">
        <div className="h-6 bg-[#546B41]/20 rounded w-3/4 mb-4"></div>
        <div className="h-12 bg-[#546B41]/20 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-[#546B41]/20 rounded w-full"></div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-[#DCCCAC] border border-[#546B41] rounded-3xl p-6 text-center shadow-none">
        <AlertCircle size={32} className="mx-auto text-black/50 mb-2" />
        <p className="text-black font-semibold text-sm">Weather data unavailable</p>
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
      <div className="bg-[#99AD7A] border border-[#546B41] rounded-3xl p-6 text-black shadow-none">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[#546B41] font-bold text-sm mb-1 uppercase tracking-wider">
              {location || 'Current Location'}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-5xl font-bold">{weather.current.temp}°C</span>
              {getWeatherIcon(weather.current.icon, 48)}
            </div>
          </div>
        </div>
        
        <p className="text-black font-bold text-lg capitalize mb-4">
          {weather.current.description}
        </p>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#546B41]/30">
          <div className="flex items-center gap-2">
            <Thermometer size={18} />
            <div>
              <p className="text-xs font-bold text-[#546B41] uppercase">Feels Like</p>
              <p className="font-black">{weather.current.feels_like}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets size={18} />
            <div>
              <p className="text-xs font-bold text-[#546B41] uppercase">Humidity</p>
              <p className="font-black">{weather.current.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind size={18} />
            <div>
              <p className="text-xs font-bold text-[#546B41] uppercase">Wind</p>
              <p className="font-black">{weather.current.wind_speed} km/h</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-[#FFF8EC] border border-[#546B41] rounded-3xl p-4 shadow-none">
        <h4 className="font-black text-black mb-3">7-Day Forecast</h4>
        <div className="space-y-2">
          {weather.forecast.map((day: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-2 hover:bg-[#DCCCAC] rounded-xl transition-colors border border-transparent hover:border-[#546B41]/30"
            >
              <span className="text-sm font-bold text-black w-20">{day.day}</span>
              <div className="flex items-center gap-2 flex-1 justify-center">
                {getWeatherIcon(day.icon, 20)}
                <span className="text-xs font-bold text-black capitalize hidden sm:inline">{day.description}</span>
              </div>
              <span className="text-sm font-black text-black w-12 text-right">{day.temp}°C</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {weather.recommendation && (
        <div className="bg-[#DCCCAC] border border-[#546B41] rounded-3xl p-4 shadow-none">
          <h4 className="font-black text-black mb-3 flex items-center gap-2">
            <Sun size={20} className="text-[#546B41]" />
            Travel Tips
          </h4>
          <div className="space-y-2">
            <p className="text-sm font-bold text-black">
              <span className="uppercase tracking-wider text-[#546B41]">Best time: </span> {weather.recommendation.bestTimeToVisit}
            </p>
            <ul className="space-y-1">
              {weather.recommendation.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-black font-semibold">
                  <span className="text-[#546B41] mt-1">•</span>
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
