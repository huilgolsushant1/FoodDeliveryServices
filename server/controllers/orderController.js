const { calculateShortestPath } = require('./pathCalculationController.js')
const { selectModeOfTransport } = require('./modeOfTransportController.js')
const { redisClient, mongoClient, neo4jClient } = require('../database.js')
const neo4j = require('neo4j-driver');
const { calculateTotalPrice } = require('../routers/getDynamicPrice.js')
const { getDriverLocation } = require('./allocateRider.js')
const { ObjectId } = require('mongodb');

const placeTheOrder = async (req, res) => {
    try {

        let reqObj = req.body;

        //allocate rider to order
        let response = reqObj;
        response.orderDetails.rider = await getDriverLocation(reqObj.orderDetails.restaurantName, reqObj.orderDetails.rider.modeOfTransport)
        response.orderDetails.orderStatus = 'confirmed';

        //add it to mongo db 
        const db = mongoClient.db("FoodDeliveryService");
        const ordersCollection = db.collection("orders");

        const resultInsert = await ordersCollection.insertOne(reqObj.orderDetails);
        //update neo4j status

        updateRiderStatus(response.orderDetails.rider.riderId.low, "assigned")

        if (resultInsert.insertedId) {
            response.orderDetails.orderId = resultInsert.insertedId.toString();
            await redisClient.set(Buffer.from(response.orderDetails.customerName.toLowerCase().trim().replace(' ', '') + response.orderDetails.customerId).toString('base64'), JSON.stringify(response));
            res.status(200).json({
                success: true,
                data: response,
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

const updateRiderStatus = async (riderId, status) => {
    try {

        var session = neo4jClient.session({
            database: "neo4j",
            defaultAccessMode: neo4j.session.WRITE,
        });

        const routeQuery = `
        MATCH (r:Rider {id: $riderId})
        SET r.status = $status
        RETURN r
        `;
        //const riderId = riderId;
        const result = await session.run(routeQuery, { riderId, status });
        console.log('Rider Updated Status in neo4j', riderId);

        //update rider status  mongo
        const db = mongoClient.db("FoodDeliveryService");
        const riderCollection = db.collection("riders");

        const filter = { "id": riderId };
        console.log(JSON.stringify(filter))
        const updatedDocument = {
            $set: {
                status: status // New value for the key to be updated
            }
        };

        const resultUpdate = await riderCollection.updateOne(filter, updatedDocument);
    }
    catch (e) {
        console.log("error updating rider status");
        console.log(e)
    }
}

const checkPrice = async (req, res) => {
    try {

        let reqObj = req.body;

        let shortestPaths = await calculateShortestPath(reqObj.restaurantName, reqObj.deliveryAddress);
        console.log(shortestPaths)
        shortestPaths = Array(shortestPaths).sort((a, b) => a.travelTime - b.travelTime);
        let modeOfTransport = "car";//calculateModeOfTransport(shortestPaths[0], reqObj.orderedItems)
        let deliveryCharge = 2300; //calculateTotalPrice(shortestPaths[0].distance, reqObj.customerName, reqObj.customerId, modeOfTransport)
        reqObj.rider = {
            "modeOfTransport": modeOfTransport,
            "deliveryCharge": deliveryCharge
        };
        let customerDetails = JSON.parse(await redisClient.get(Buffer.from(reqObj.customerName.toLowerCase().trim().replace(' ', '') + reqObj.customerId).toString('base64')));
        let response = {
            "shortestPaths": shortestPaths,
            "weather": "sunny",
            "orderDetails": reqObj
        }
        res.status(200).json({
            success: true,
            message: "Price calculated",
            data: response
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

const updateStatus = async (req, res) => {

    try {

        orderId = req.body.orderId;
        customerName = req.body.customerName;
        customerId = req.body.customerId;
        orderStatus = req.body.orderStatus;
        deliveryCode = req.body.deliveryCode;
        riderId = req.body.riderId;
        if (orderId && customerName && customerId && orderStatus) {
            //if status is delivered remove order related data and update in mongo riders and neo4j
            if (orderStatus.toLowerCase === "delivered" && deliveryCode && riderId) {
                redisKey = Buffer.from(customerName.toLowerCase().trim().replace(' ', '') + customerId).toString('base64');
                customerObj = await redisClient.get(redisKey);
                customerObj.orderDetails = {};
                await redisClient.set(redisKey, customerObj);

                //rider status update
                updateRiderStatus(riderId, "available");

                //orders status update
                const ordersCollection = db.collection("orders");
                const orderUpdatedDoc = {
                    $set: {
                        "orderStatus": "delivered"
                    }
                };
                const orderUpdate = await ordersCollection.updateOne({ "id": new ObjectId(orderId) }, orderUpdatedDoc);
                console.log(orderUpdate)
                res.status(200).json({ message: "Order Delivered!" });
            } else if (orderStatus) {
                //else update status in redis
                redisKey = Buffer.from(customerName.toLowerCase().trim().replace(' ', '') + customerId).toString('base64');
                customerObj =JSON.parse( await redisClient.get(redisKey));
                console.log(redisKey)
                customerObj.orderDetails.orderStatus = orderStatus;
                await redisClient.set(redisKey, JSON.stringify(customerObj));
                res.status(200).json({ message: "Order Status Updated!" });

            }
            else {
                res.status(400).json({ message: "Input parameters invalid" });
            }
        }
        else {
            res.status(400).json({ message: "Input parameters invalid" });
        }
    }
    catch (e) {
        console.log(e);
    }
}

const fetchOrderStatus = async(req, res)=>{
    try{
        redisKey = Buffer.from(req.body.customerName.toLowerCase().trim().replace(' ', '') + req.body.customerId).toString('base64');
        customerObj = await redisClient.get(redisKey);
    }
    catch(e)
    {
        console.log(e);
    }
}

module.exports = { placeTheOrder, checkPrice, updateStatus }