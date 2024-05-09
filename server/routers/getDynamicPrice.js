const { mongoClient } = require('../database');

const baseFare = 20; 

// distance
function calculateDistanceIncrement(distance) {
   if (distance <= 1000) {
    return 0;
  }
  const excessDistance = distance - 1000;
  const distanceIncrement = Math.ceil(excessDistance / 500) * (baseFare / 10);
  return distanceIncrement;
}

// weather condition
function calculateWeatherIncrement(weather) {
  const weatherFactor = 0.2; // Additional charge for bad weather
  return weather === 'rainy' || weather === 'snowy' ? baseFare * weatherFactor : 0;
}

async function calculateDemandIncrement(mode) {
  const demandFactor = 0.3;
  try {
    await mongoClient.connect();
    const db = mongoClient.db("FoodDeliveryService");
    const ordersCollection = db.collection("orders");
    const ridersCollection = db.collection("riders");

    const pendingOrdersCount = await ordersCollection.countDocuments({
      orderStatus: 'Pending',
      "rider.modeOfTransport": { "$regex": mode, "$options": "i" }
    });

    const availableRidersCount = await ridersCollection.countDocuments({
      status: { $ne: 'offline' },
      vehicleType: { "$regex": mode, "$options": "i" }
    });

    const demand = pendingOrdersCount / 1;
    if (demand > 2) {
      return baseFare * demandFactor;
    }
    return 0;
    
  } catch (error) {
    console.error("Error fetching pending orders and available riders:", error);
    throw error; // Decide whether to handle errors or throw them
  }
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
async function calculateTotalPrice(distance, weather, mode) {
  //redis weather key Buffer.from(customerName.toLowerCase().trim().replace(' ', '') + customerId).toString('base64')
  //demand from db
  
  const distanceIncrement = calculateDistanceIncrement(distance);
  const weatherIncrement = calculateWeatherIncrement(weather);
  const demandIncrement = await calculateDemandIncrement(mode);
  const modeIncrement = calculateModeIncrement(mode);
  console.log(demandIncrement);

  const totalPrice = baseFare + distanceIncrement + weatherIncrement + demandIncrement + modeIncrement;
  return totalPrice;
}

module.exports = calculateTotalPrice;
