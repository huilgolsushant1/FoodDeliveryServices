const express = require('express');
const { neo4jClient } = require('../database.js')
const neo4j = require('neo4j-driver');

async function getCuisineRestaurantsController(req, res) {
  const session = neo4jClient.session({ database: "neo4j", defaultAccessMode: neo4j.session.READ });

  try {
    const cuisineRestaurantsQuery = `
      MATCH (cuisine:Cuisine)<-[:BELONGSTO]-(dish:Dish)<-[:SERVES]-(restaurant:Restaurant)<-[review:REVIEWED]-(customer:Customer)
      WITH cuisine, restaurant, round(avg(review.rating) * 10) / 10 AS avgRating
      ORDER BY cuisine.name, avgRating DESC
      WITH cuisine, collect({restaurantId: restaurant.id, name: restaurant.name, avgRating: avgRating})[..5] AS topRestaurants
      RETURN cuisine.name AS cuisine, topRestaurants 
    `;

    const result = await session.run(cuisineRestaurantsQuery);

    const cuisineRestaurants = result.records.map(record => ({
      cuisine: record.get("cuisine"),
      topRestaurants: record.get("topRestaurants")
    }));

    res.status(200).json({
      success: true,
      data: cuisineRestaurants,
      message: "Top Restaurants for each Cuisine"
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
  getCuisineRestaurantsController
};
