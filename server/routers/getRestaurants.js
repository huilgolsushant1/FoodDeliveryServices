const express= require ('express');
const router = express.Router();
const { client } = require('../database.js')

router.get('/restaurants', async (req, res) => {
    try {
      const db = client.db("FoodDeliveryService");
      const collection = db.collection("restaurants");
      const restaurants = await collection.find({}).toArray();
      res.json(restaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      res.status(500).json({ error: 'Server Error' });
    }
  });

module.exports = router;