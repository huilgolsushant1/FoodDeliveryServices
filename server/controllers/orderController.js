const { calculateShortestPath } = require('./pathCalculationController.js')
const { selectModeOfTransport } = require('./modeOfTransportController.js')
const { redisClient, mongoClient } = require('../database.js')
const { calculateTotalPrice } = require('../routers/getDynamicPrice.js')
const { getDriverLocation } = require('./allocateRider.js')
const placeTheOrder = async (req, res) => {
    try {

        let reqObj = req.body;
        // {
        //     "shortestPaths": [
        //         {
        //             "path": [],
        //             "distance": 2345,
        //             "totalTravelTime": 30
        //         },
        //         {
        //             "path": [],
        //             "distance": 2345,
        //             "totalTravelTime": 30
        //         },
        //         {
        //             "path": [],
        //             "distance": 2345,
        //             "totalTravelTime": 30
        //         }
        //     ],
        //     "weather": "snowy",
        //     "orderDetails": {
        //         "orderId": "123",
        //         "restaurantId": 123,
        //         "restaurantName": "Kalesh's Corner",
        //         "orderedItems": [{
        //             "dish": "Waffles - choco",
        //             "price": "123",
        //             "quantity": 2
        //         },
        //         {
        //             "dish": "Waffles - cherry",
        //             "price": "123",
        //             "quantity": 2
        //         }
        //         ],
        //         "customerName": "Kalesh Patil",
        //         "customerId":1,
        //         "deliveryAddress": "Kalesh's Cross",
        //         "totalPrice": 2300,
        //         "rider": {
        //             "riderId": 8,
        //             "riderName": "Kalesh's Rider",
        //             "modeOfTransport": "Car",
        //             "deliveryCharge": "200"
        //         },
        //         "orderStatus": "Pending"
        //     }

        // }

        // const shortestPaths = [
        //     {
        //         "path": [],
        //         "distance": 2345,
        //         "totalTravelTime": 30
        //     },
        //     {
        //         "path": [],
        //         "distance": 2345,
        //         "totalTravelTime": 30
        //     },
        //     {
        //         "path": [],
        //         "distance": 2345,
        //         "totalTravelTime": 30
        //     }
        // ];
        // const weather = "snowy";
        // const orderDetails = {
        //     "orderId": "123",
        //     "restaurantId": 123,
        //     "restaurantName": "Kalesh's Corner",
        //     "orderedItems": [{
        //         "dish": "Waffles - choco",
        //         "price": "123",
        //         "quantity": 2
        //     },
        //     {
        //         "dish": "Waffles - cherry",
        //         "price": "123",
        //         "quantity": 2
        //     }
        //     ],
        //     "customerId":1,
        //     "customerName": "Kalesh Patil",
        //     "deliveryAddress": "Kalesh's Cross",
        //     "totalPrice": 2300,
        //     "rider": {
        //         "riderId": 6,
        //         "riderName": "Kalesh's Rider",
        //         "modeOfTransport": "Car",
        //         "deliveryCharge": "200"
        //     },
        //     "orderStatus": "Pending"
        // };

        // //store this in redis key
        // let encoded=Buffer.from("Hello World").toString('base64');
        // console.log(Buffer.from(encoded, 'base64').toString('ascii'));

        //allocate rider to order
        let response=reqObj;
        response.orderDetails.rider=await getDriverLocation(reqObj.orderDetails.restaurantName, reqObj.orderDetails.rider.modeOfTransport)
        

        //add it to mongo db 
        const db = mongoClient.db("FoodDeliveryService");
        const ordersCollection = db.collection("orders");

        const resultInsert = await ordersCollection.insertOne(reqObj.orderDetails);
        console.log(resultInsert)
         
        //update rider status 
        const riderCollection = db.collection("riders");
        console.log(response.orderDetails.rider.riderId.low)
        const filter = { "id": response.orderDetails.rider.riderId.low };
        console.log(JSON.stringify(filter))
        const updatedDocument = {
            $set: {
                status: 'assigned' // New value for the key to be updated
            }
        };

        const resultUpdate = await riderCollection.updateOne(filter, updatedDocument);
        console.log(resultUpdate)

        if (resultInsert.insertedId && resultUpdate.modifiedCount) {
            await redisClient.set(Buffer.from(response.orderDetails.customerName.toLowerCase().trim().replace(' ', '') + response.orderDetails.customerId).toString('base64'), JSON.stringify(response));
            res.status(200).json({
                success: true,
                data:response,
                message: "Order Confirmed!"
            });
        }
        else {
            res.status(200).json({
                success: false,
                message: "Order Placement Failed!"
            });
        }

    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

const checkPrice = async (req, res) => {
    try {

        let reqObj = req.body;

        let shortestPaths =await calculateShortestPath(reqObj.restaurantName, reqObj.deliveryAddress);
        console.log(shortestPaths)
        shortestPaths = Array(shortestPaths).sort((a, b) => a.travelTime - b.travelTime);
        let modeOfTransport="car";//calculateModeOfTransport(shortestPaths[0], reqObj.orderedItems)
        let deliveryCharge=2300; //calculateTotalPrice(shortestPaths[0].distance, reqObj.customerName, reqObj.customerId, modeOfTransport)
        reqObj.rider={
            "modeOfTransport":modeOfTransport,
            "deliveryCharge":deliveryCharge
        };
        console.log(Buffer.from(reqObj.customerName.toLowerCase().trim().replace(' ', '') + reqObj.customerId).toString('base64'))
        let customerDetails=JSON.parse(await redisClient.get(Buffer.from(reqObj.customerName.toLowerCase().trim().replace(' ', '') + reqObj.customerId).toString('base64')));
        let response= {
            "shortestPaths": shortestPaths,
            "weather": customerDetails.weather,
            "orderDetails":reqObj
        }
        res.status(200).json({
            success: true,
            message: "Price calculated",
            data:response
        })

    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

module.exports = { placeTheOrder, checkPrice}