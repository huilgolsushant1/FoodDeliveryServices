const express = require("express");
const router = express.Router();
const { client } = require("../database.js");

router.get("/restaurants", async (req, res) => {
  try {
    const db = client.db("FoodDeliveryService");
    const collection = db.collection("restaurants");
    const restaurants = await collection.find({}).toArray();
    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const db = client.db("FoodDeliveryService");
    const restaurantsCollection = db.collection("restaurants");
    const ordersCollection = db.collection("orders");
    const restaurants = await restaurantsCollection.find({}).toArray();
    const orders = await ordersCollection.find({}).toArray();

    const pendingOrders = [];
    restaurants.forEach((restaurant) => {
      orders.forEach((order) => {
        if (
          restaurant.id == order.restaurantId &&
          order.orderStatus === "pending"
        ) {
          let data = {
            restaurantName: restaurant.name,
            restaurantsId: restaurant.id,
            orderId: order.orderId,
            orderItems: order.orderedItems,
            customerName: order.customerName,
            totalPrice: order.totalPrice,
            orderStatus: order.orderStatus,
          };
          pendingOrders.push(data);
        }
      });
    });
    res.json(pendingOrders);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
