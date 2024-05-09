const { calculateShortestPath } = require('./pathCalculationController.js')
const { selectModeOfTransport } = require('./modeOfTransportController.js')
const { redisClient, mongoClient, neo4jClient } = require('../database.js')
const neo4j = require('neo4j-driver');
const { calculateTotalPrice } = require('../routers/getDynamicPrice.js')
const { getDriverLocation } = require('./allocateRider.js')
const placeTheOrder = async (req, res) => {
    try {

        let reqObj = req.body;

        //allocate rider to order
        let response=reqObj;
        response.orderDetails.rider=await getDriverLocation(reqObj.orderDetails.restaurantName, reqObj.orderDetails.rider.modeOfTransport)
        

        //add it to mongo db 
        const db = mongoClient.db("FoodDeliveryService");
        const ordersCollection = db.collection("orders");

        const resultInsert = await ordersCollection.insertOne(reqObj.orderDetails);
        console.log(resultInsert)

        //update neo4j status
        var session = neo4jClient.session({
            database: "neo4j",
            defaultAccessMode: neo4j.session.WRITE,
          });

          const routeQuery = `
          MATCH (r:Rider {id: $riderId})
          SET r.status = 'assigned'
          RETURN r
          `;
          const riderId = response.orderDetails.rider.riderId.low;
          const result = await session.run(routeQuery, { riderId });
          console.log('Rider Updated Status', riderId);
         
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
            "weather": "sunny",
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