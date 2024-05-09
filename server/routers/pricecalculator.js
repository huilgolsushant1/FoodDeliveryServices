const calculatePrice = require('./getDynamicPrice');

// Example usage
const distance = 2500; 
const weather = 'rainy'; 
const demand = 'high'; 
const mode = "bike"; 

// Call the calculatePrice function with the provided parameters
const totalPriceObject = calculatePrice(distance, weather, demand, mode);

// Extract the totalPrice from the returned object
const totalPrice = totalPriceObject.totalPrice;

console.log("Total Price:", totalPrice);
