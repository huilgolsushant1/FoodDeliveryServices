const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/weather', async (req, res) => {
  try {
    // Extract location from query parameters
    const location = "heidelberg";
    
    if (!location) {
      return res.status(400).json({ error: 'Location parameter is missing' });
    }

    // Fetch weather data using weatherapi.com API
    const apiKey = 'f5b7ac4a88014420b2e163532240705';
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

    const response = await axios.get(apiUrl);
    const weatherData = response.data;

    // Extract only the weather condition from the response
    const conditionText = weatherData.current.condition.text.toLowerCase(); // Convert to lowercase for easier comparison
    let weatherCategory;

    // Categorize the weather condition
    if (conditionText.includes('rain') || conditionText.includes('drizzle')) {
      weatherCategory = 'rainy';
    } else if (conditionText.includes('snow') || conditionText.includes('sleet')) {
      weatherCategory = 'snowy';
    } else {
      weatherCategory = 'sunny';
    }

    res.json({ weatherCategory });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
