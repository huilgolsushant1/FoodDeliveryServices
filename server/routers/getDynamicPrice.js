// Sample data for demonstration
const baseFare = 20; // Base fare for any ride

// distance
function calculateDistanceIncrement(distance) {
  if (distance < 1000) {
    return 0;
  }
  return ((((distance - 1000) % 500) / 10) * baseFare);
}

// weather condition
function calculateWeatherIncrement(weather) {
  const weatherFactor = 0.2; // Additional charge for bad weather
  return weather === 'rainy' || 'snowy' ? baseFare * weatherFactor : 0;
}

// demand
function calculateDemandIncrement(demand) {
  const demandFactor = 0.3; 
  return demand === 'high' ? baseFare * demandFactor : 0;
}

//mode of transport
function calculateModeIncrement(mode) {
  let modeFactor = 0;
  switch (mode.toLowerCase()) {
    case "bike":
      modeFactor = 0.2;
      break;
    case "car":
      modeFactor = 0.3; 
      break;
    case "bicycle":
      modeFactor = 0.1; 
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

// Function to calculate dynamic pricing
function calculatePrice(distance, weather, demand, mode) {
  try {
    // Calculate total price based on the provided dynamic values
    const totalPrice = calculateTotalPrice(distance, weather, demand, mode);
    return { totalPrice };
  } catch (error) {
    console.error("Error calculating price:", error);
    throw new Error('Server Error');
  }
}

module.exports = { calculateTotalPrice };
