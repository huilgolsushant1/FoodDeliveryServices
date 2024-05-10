const { calculateShortestPath } = require("./pathCalculationController.js");
const {
    selectModeOfTransport,
    setOrder,
} = require("./modeOfTransportController.js");
const { redisClient, mongoClient, neo4jClient } = require("../database.js");
const neo4j = require("neo4j-driver");
const { calculateTotalPrice } = require("../routers/getDynamicPrice.js");
const { getDriverLocation } = require("./allocateRider.js");
const { ObjectId } = require('mongodb');

const placeTheOrder = async (req, res) => {
    try {
        let reqObj = req.body;

        //allocate rider to order

        let response = reqObj;
        response.orderDetails.rider = await getDriverLocation(
            reqObj.orderDetails.restaurantName,
            reqObj.orderDetails.rider.modeOfTransport
        );
        response.orderDetails.orderStatus = "confirmed";
        response.orderDetails.deliveryCode = Math.floor(1000 + Math.random() * 9000);
        response.orderDetails.rider.pickUpCode = Math.floor(1000 + Math.random() * 9000);
        //add it to mongo db
        const db = mongoClient.db("FoodDeliveryService");
        const ordersCollection = db.collection("orders");

        const resultInsert = await ordersCollection.insertOne(reqObj.orderDetails);
        //update neo4j status

        updateRiderStatus(response.orderDetails.rider.riderId, "assigned")

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

        let shortestPaths = await calculateShortestPath(
            reqObj.restaurantName,
            reqObj.deliveryAddress
        );

        shortestPaths = Array(shortestPaths).sort(
            (a, b) => a.travelTime - b.travelTime
        );

        console.log(shortestPaths)
        let modeAndWeather = await selectModeOfTransport(
            shortestPaths[0][0],
            reqObj.orderedItems,
            reqObj.customerName,
            reqObj.customerId
        );
        console.log(modeAndWeather);

        let deliveryCharge = 2300; //calculateTotalPrice(shortestPaths[0].distance, reqObj.customerName, reqObj.customerId, modeOfTransport)
        // reqObj.rider = {
        //   modeOfTransport: modeOfTransport,
        //   deliveryCharge: deliveryCharge,
        // };
        console.log(
            Buffer.from(
                reqObj.customerName.toLowerCase().trim().replace(" ", "") +
                reqObj.customerId
            ).toString("base64")
        );
        let customerDetails = JSON.parse(
            await redisClient.get(
                Buffer.from(
                    reqObj.customerName.toLowerCase().trim().replace(" ", "") +
                    reqObj.customerId
                ).toString("base64")
            )
        );


        let response = {
            orderDetails: reqObj
        }
        response.orderDetails.rider = modeAndWeather.orderDetails.rider;
        response.orderDetails.weather = modeAndWeather.orderDetails.weather;
        response.shortestPaths = shortestPaths;
        response.orderDetails.rider.deliveryCharge = deliveryCharge;
        res.status(200).json({
            success: true,
            message: "Price calculated",
            data: response,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};

module.exports = { placeTheOrder, checkPrice };

const updateStatus = async (req, res) => {

    try {

        orderId = req.body.orderId;
        customerName = req.body.customerName;
        customerId = req.body.customerId;
        orderStatus = req.body.orderStatus;
        deliveryCode = req.body.deliveryCode;
        pickupCode = req.body.pickUpCode
        riderId = req.body.riderId;
        if (orderId && customerName && customerId && orderStatus) {
            //if status is delivered remove order related data and update in mongo riders and neo4j
            if (orderStatus.toLowerCase === "delivered" && deliveryCode && riderId) {
                redisKey = Buffer.from(customerName.toLowerCase().trim().replace(' ', '') + customerId).toString('base64');
                customerObj = JSON.parse(await redisClient.get(redisKey));
                if (deliveryCode !== customerObj.deliveryCode) {
                    return res.status(200).json({ message: "Delivery code invalid" })
                }
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
                return res.status(200).json({ message: "Order Delivered!" });
            
            } else if (orderStatus) {
                redisKey = Buffer.from(customerName.toLowerCase().trim().replace(' ', '') + customerId).toString('base64');
                customerObj = JSON.parse(await redisClient.get(redisKey));
                
                if(orderStatus.toLowerCase()==="out for delivery")
                {
                    console.log('Code', customerObj.orderDetails.rider.pickUpCode)
                    console.log('Temp Code', req.body)
                    if (pickupCode !== parseInt(customerObj.orderDetails.rider.pickUpCode)) {
                        return res.status(200).json({ message: "Pickup code invalid" })
                    }
                    //else update status in redis
                }
                
            //else update status in redis
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

const fetchOrderStatus = async (req, res) => {
    try {
        redisKey = Buffer.from(req.body.customerName.toLowerCase().trim().replace(' ', '') + req.body.customerId).toString('base64');
        customerObj = await redisClient.get(redisKey);
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = { placeTheOrder, checkPrice, updateStatus }