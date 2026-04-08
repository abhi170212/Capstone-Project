const axios = require('axios');

// @desc  Get current weather for a location
// @route GET /api/weather/current?lat=x&lng=y
// @access Public
const getCurrentWeather = async (req, res, next) => {
  try {
    const { lat, lng, city } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        message: 'Latitude and longitude are required' 
      });
    }

    // Use OpenWeatherMap API (free tier)
    const apiKey = process.env.WEATHER_API_KEY || 'demo_key';
    
    // For demo purposes, return mock data if no API key
    if (apiKey === 'demo_key') {
      return res.json({
        success: true,
        data: {
          current: {
            temp: 28,
            feels_like: 30,
            humidity: 65,
            description: 'Partly Cloudy',
            icon: 'partly-cloudy',
            wind_speed: 12,
            visibility: 10,
            uv_index: 6,
          },
          forecast: [
            { day: 'Today', temp: 28, icon: 'partly-cloudy', description: 'Partly Cloudy' },
            { day: 'Tomorrow', temp: 30, icon: 'sunny', description: 'Sunny' },
            { day: 'Wednesday', temp: 27, icon: 'rainy', description: 'Light Rain' },
            { day: 'Thursday', temp: 26, icon: 'cloudy', description: 'Overcast' },
            { day: 'Friday', temp: 29, icon: 'sunny', description: 'Clear Sky' },
            { day: 'Saturday', temp: 31, icon: 'sunny', description: 'Hot' },
            { day: 'Sunday', temp: 28, icon: 'partly-cloudy', description: 'Partly Cloudy' },
          ],
          recommendation: {
            bestTimeToVisit: 'Early morning or late evening',
            weatherAlert: null,
            suitable: true,
            tips: ['Carry water', 'Use sunscreen', 'Light clothing recommended'],
          },
        },
      });
    }

    // Real API call if key is provided
    const currentWeather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
    );

    const forecast = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
    );

    // Process and format data
    const formattedData = {
      current: {
        temp: currentWeather.data.main.temp,
        feels_like: currentWeather.data.main.feels_like,
        humidity: currentWeather.data.main.humidity,
        description: currentWeather.data.weather[0].description,
        icon: currentWeather.data.weather[0].icon,
        wind_speed: currentWeather.data.wind.speed,
        visibility: currentWeather.data.visibility / 1000,
      },
      forecast: forecast.data.list.slice(0, 7).map(item => ({
        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temp: item.main.temp,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      })),
    };

    res.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('Weather API Error:', error.message);
    next(error);
  }
};

// @desc  Get weather recommendation
// @route GET /api/weather/recommendation?lat=x&lng=y&month=January
// @access Public
const getWeatherRecommendation = async (req, res, next) => {
  try {
    const { month } = req.query;

    // Bihar weather patterns by month
    const weatherPatterns = {
      January: { temp: '10-21°C', condition: 'Cool & Pleasant', bestFor: 'Sightseeing', tips: ['Carry light woolens'] },
      February: { temp: '13-25°C', condition: 'Pleasant', bestFor: 'All activities', tips: ['Light clothing'] },
      March: { temp: '18-32°C', condition: 'Warm', bestFor: 'Early morning visits', tips: ['Sunscreen required'] },
      April: { temp: '24-38°C', condition: 'Hot', bestFor: 'Indoor activities', tips: ['Stay hydrated', 'Avoid afternoon sun'] },
      May: { temp: '27-40°C', condition: 'Very Hot', bestFor: 'Not recommended', tips: ['Avoid travel if possible'] },
      June: { temp: '28-38°C', condition: 'Hot & Humid', bestFor: 'Monsoon begins', tips: ['Carry umbrella'] },
      July: { temp: '26-34°C', condition: 'Monsoon', bestFor: 'Lush green views', tips: ['Rain gear essential'] },
      August: { temp: '26-33°C', condition: 'Heavy Monsoon', bestFor: 'Limited outdoor', tips: ['Check weather alerts'] },
      September: { temp: '25-33°C', condition: 'Monsoon ending', bestFor: 'Post-monsoon beauty', tips: ['Light rain possible'] },
      October: { temp: '22-31°C', condition: 'Pleasant', bestFor: 'Festivals & tourism', tips: ['Best time to visit'] },
      November: { temp: '16-28°C', condition: 'Cool & Dry', bestFor: 'All activities', tips: ['Peak tourist season'] },
      December: { temp: '11-23°C', condition: 'Cool', bestFor: 'Winter tourism', tips: ['Carry woolens'] },
    };

    const recommendation = month ? weatherPatterns[month] : weatherPatterns['November'];

    res.json({
      success: true,
      data: {
        month: month || 'November',
        ...recommendation,
        overallRating: ['October', 'November', 'December', 'January', 'February'].includes(month) ? 'Excellent' : 'Good',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentWeather,
  getWeatherRecommendation,
};
