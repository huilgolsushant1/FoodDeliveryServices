const calculateTotalPrice = require('./dynamicPrice');
const weatherInfo = require('./weatherinfo');
const updateDeliveryCharge = require('./weatherinfo');


let customerName = "Anusha Tirumalaneedi";
let customerId = 2;
let code = Buffer.from(
customerName.toLowerCase().trim().replace(" ", "") + customerId
).toString("base64");


const distance = 4500;//calculateModeOfTransport(shortestPaths[0], reqObj.orderedItems)
const weather = await weatherInfo(code);
const mode = 'bike';
console.log(weather);
// Call the calculateTotalPrice function with the provided parameters
const totalPrice = calculateTotalPrice(distance, weather, mode)
.then(totalPrice => {
    console.log("Total Price:", totalPrice);
})
.catch(error => {
    console.error("Error calculating total price:", error);
});

// await updateDeliveryCharge(code, totalPrice);