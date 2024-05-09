const express = require('express');
const { getDriverLocation } = require('../controllers/allocateRider');
const { mongoClient } = require('../database.js');

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const db = mongoClient.db("FoodDeliveryService");
        const collection = db.collection("riders");
        const riders = await collection.find().toArray();
        res.json(riders);
    }
    catch (e) {

    }
});
router.get("/order", async (req, res) => {
    try {
        const riderId =parseInt(req.query.riderId);
        console.log(riderId)
        if (riderId > 0) {
            const db = mongoClient.db("FoodDeliveryService");
            const collection = db.collection("orders");
            const orders = await collection.find({
                "rider.riderId.low": riderId, // Using dot notation for nested field
                orderStatus: "confirmed"
            }).toArray();
            console.log(orders)
            res.json(orders);
        } else {
            res.status(400).json({ error: 'Rider ID not provided or invalid' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;