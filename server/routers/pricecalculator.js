const { redisClient } = require("../database.js");
// const calculateTotalPrice = require('./getDynamicPrice');

// const distance = 4500;
// const weather = 'rainy';
// const mode = 'bike';

// // Call the calculateTotalPrice function with the provided parameters
// calculateTotalPrice(distance, weather, mode)
//   .then(totalPrice => {
//     console.log("Total Price:", totalPrice);
//   })
//   .catch(error => {
//     console.error("Error calculating total price:", error);
//   });
async function getOrder(code,order) {
  try {
    let orderData = await redisClient.get(String(code), JSON.stringify(order));
    console.log(orderData);
    return "Order successfully fetch!";
  } catch (error) {
    console.error("Error fetching order in Redis:", error);
    throw error;
  }
}
 
let customerName = "Kalesh Patil";
let customerId = 1;
let code = Buffer.from(
  customerName.toLowerCase().trim().replace(" ", "") + customerId
).toString("base64");

getOrder(code);

