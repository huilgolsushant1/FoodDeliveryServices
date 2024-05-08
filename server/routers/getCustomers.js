const express = require("express");
const router = express.Router();
const { mongoClient } = require("../database.js");

router.get("/customers", async (req, res) => {
    try {
      const db = mongoClient.db("FoodDeliveryService");
      const customersCollection = db.collection("customers");
  
      const topCustomers = await customersCollection.find({}).limit(5).toArray();
      res.json(topCustomers);
    } catch (error) {
      console.error("Error fetching top customers:", error);
      res.status(500).json({ error: "Server Error" });
    }
  });

  module.exports = router;