const express = require('express');
const router = express.Router();

// Sample data for demonstration
const baseFare = 20; // Base fare for any ride

// Function to calculate price increment based on distance
function calculateDistanceIncrement(distance) {
  if(distance < 1000) {
    return 0;
  }
  return ((((distance - 1000) % 500) / 10) * baseFare);
}

// Function to calculate price increment based on weather condition
function calculateWeatherIncrement(weather) {
  const weatherFactor = 0.2; // Additional charge for bad weather
  return weather === 'bad' ? baseFare * weatherFactor : 0;
}

// Function to calculate price increment based on demand
function calculateDemandIncrement(demand) {
  const demandFactor = 0.3; // Additional charge for high demand
  return demand === 'high' ? baseFare * demandFactor : 0;
}

// Function to calculate price increment based on mode of transport
function calculateModeIncrement(mode) {
  let modeFactor = 0;
  switch (mode.toLowerCase()) {
    case "bike":
      modeFactor = 0.2; // Example base price for bike
      break;
    case "car":
      modeFactor = 0.3; // Example base price for car
      break;
    case "bicycle":
      modeFactor = 0.1; // Example base price for bicycle
      break;
  }
  return baseFare * modeFactor;
}

// Function to calculate total price
function calculateTotalPrice(distance, customerName, customerId, mode) {
  //redis weather key Buffer.from(customerName.toLowerCase().trim().replace(' ', '') + customerId).toString('base64')
  //demand from db
  const distanceIncrement = calculateDistanceIncrement(distance);
  const weatherIncrement = calculateWeatherIncrement("snowy");
  const demandIncrement = 23;//calculateDemandIncrement(demand);
  const modeIncrement = calculateModeIncrement(mode);

  const totalPrice = baseFare + distanceIncrement + weatherIncrement + demandIncrement + modeIncrement;
  return totalPrice;
}

// Route for calculating dynamic pricing
router.get('/calculatePrice', async (req, res) => {
  try {
    // Manually set dynamic values (you can replace these with values from req.query if needed)
    const distance = 2500; // Example distance
    const weather = 'bad'; // Example weather condition
    const demand = 'high'; // Example demand
    const mode = "car"; // Mode of transport

    // Calculate total price based on manual dynamic values
    const totalPrice = calculateTotalPrice(distance, weather, demand, mode);

    res.json({ totalPrice });
  } catch (error) {
    console.error("Error calculating price:", error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = { calculateTotalPrice };
