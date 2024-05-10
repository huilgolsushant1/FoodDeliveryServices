const { redisClient, mongoClient, neo4jClient } = require('../database.js');




async function weatherInfo(code, newData) {
    try {
      let orderData = await redisClient.get(String(code));
      let data = JSON.parse(orderData);
      console.log(data.orderDetails.weather);
      return(data.weather);

    } catch (error) {
      console.error("Error setting order in Redis:", error);
      throw error;
    }
  }

async function updateDeliveryCharge(code, newCharge) {
    try {
        console.log(newCharge);
        let orderData = await redisClient.get(String(code));
        let data = JSON.parse(orderData);
        data.orderDetails.rider.deliveryCharge = newCharge; 
        await redisClient.set(String(code), JSON.stringify(data)); 
        return data.orderDetails.rider.deliveryCharge; 
    } catch (error) {
        console.error("Error updating delivery charge in Redis:", error);
        throw error;
    }
}

  module.exports = weatherInfo,updateDeliveryCharge;