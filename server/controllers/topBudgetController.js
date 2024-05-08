const express = require('express');
const router = express.Router();
const { driver } = require('../database.js')
const neo4j = require('neo4j-driver');

async function topBudgetRestaurantsController(req, res) {

  const {customerName} = req.query;
  if(!customerName) res.sendStatus(500)

  // Put your cypher query here
  const topBudgetRestaurantsQuery = `MATCH (c:Customer {name: $customerName})-[:LIVES_AT]->(customerAddress:Address)
  WITH customerAddress.location AS customerLocation
  MATCH (restaurant:Restaurant)<-[rev:REVIEWED]-()
  WHERE rev.costForTwo IS NOT NULL AND point.distance(customerLocation, restaurant.location) <= 10000
  WITH restaurant, avg(rev.costForTwo) AS avgCostForTwo, point.distance(customerLocation, restaurant.location) AS distanceToCustomer
  RETURN restaurant.name,
         toInteger(avgCostForTwo) AS avgCostForTwo,
         round(distanceToCustomer / 1000, 1) AS distanceToCustomerKms
  ORDER BY avgCostForTwo ASC
  LIMIT 5
  `;

  const session = driver.session({
    database: "neo4j",
    defaultAccessMode: neo4j.session.READ,
  });

  let topBudgetRestaurants = []; 

  session
      .run(topBudgetRestaurantsQuery, {customerName})
      .subscribe({
        onNext: records => {
          // disable this log later if not needed
          // just to check the data
          console.log(records)

          topBudgetRestaurants.push({
            "restaurant_name":records.get("restaurant.name"),
            "avgCostForTwo":records.get("avgCostForTwo"),
            "distanceToCustomerKms":records.get("distanceToCustomerKms"),
          }); 
        },
        onCompleted: () => {
          session.close();
          res.status(201).json({
            success: true,
            data: topBudgetRestaurants/**put data variable to be sent here*/,
            message: "Top Rated Restaurants"
          });
        },
        onError: error => {
          console.log(error);
          session.close();
          res.status(500).json({
            success: false,
            message: error.message
          });
        }
      });

}

module.exports = {
  topBudgetRestaurantsController
}
