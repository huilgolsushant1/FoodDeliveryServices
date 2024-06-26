const express = require("express");
const router = express.Router();
const { mongoClient } = require("../database.js");

router.get("/restaurants", async (req, res) => {
  try {
    const db = mongoClient.db("FoodDeliveryService");
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
    const db = mongoClient.db("FoodDeliveryService");
    const restaurantsCollection = db.collection("restaurants");
    const ordersCollection = db.collection("orders");
    const restaurants = await restaurantsCollection.find({}).toArray();
    const orders = await ordersCollection.find({}).toArray();

    const pendingOrders = [];
    restaurants.forEach((restaurant) => {
      let data = {
        restaurantName: restaurant.name,
        restaurantsId: restaurant.id,
        orderArray: [],
      };
      orders.forEach((order) => {
        if (
          restaurant.id == order.restaurantId &&
          order.orderStatus === "confirmed"
        ) {
          let orderCart = {
            orderId: order._id,
            orderItems: order.orderedItems,
            customerName: order.customerName,
            customerId: order.customerId,
            totalPrice: order.totalPrice,
            orderStatus: order.orderStatus,
          };
          data.orderArray.push(orderCart);
        }
      });
      if (data.orderArray.length != 0) {
        pendingOrders.push(data);
      }
    });
    res.json(pendingOrders);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
