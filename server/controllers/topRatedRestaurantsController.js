const express = require('express');
const router = express.Router();
const { driver } = require('../database.js');
const neo4j = require('neo4j-driver');

async function topRatedRestaurantsController(req, res) {
  const { customerName } = req.query;

  const topRatedRestaurantsQuery = `
    MATCH (c:Customer {name: $customerName})-[:LIVES_AT]->(customerAddress:Address)
    WITH customerAddress.location AS customerLocation
    MATCH (restaurant:Restaurant)<-[rev:REVIEWED]-()
    WHERE point.distance(customerLocation, restaurant.location) <= 10000
    WITH restaurant, point.distance(customerLocation, restaurant.location) AS distanceInMeters, avg(rev.rating) AS avgRating
    RETURN restaurant.name, round(distanceInMeters / 1000, 1) AS distanceInKms, toFloat(round(avgRating * 10) / 10) AS avgRating
    ORDER BY avgRating DESC
    LIMIT 5
  `;

  const session = driver.session({
    database: "neo4j",
    defaultAccessMode: neo4j.session.READ,
  });

  let topRatedRestaurants = [];

  try {
    const result = await session.run(topRatedRestaurantsQuery, { customerName });

    result.records.forEach(record => {
      topRatedRestaurants.push({
        "restaurant_name": record.get("restaurant.name"),
        "distanceInKms": record.get("distanceInKms"),
        "avgRating": record.get("avgRating")
      });
    });

    res.status(200).json({
      success: true,
      data: topRatedRestaurants,
      message: "Top Rated Restaurants nearby within 10 km radius"
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({
      success: false,
      message: error.message
    });
  } finally {
    session.close();
  }
}

module.exports = {
  topRatedRestaurantsController
}
