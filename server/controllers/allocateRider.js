const express = require('express');
const router = express.Router();
const { driver } = require('../database.js')
const neo4j = require('neo4j-driver');


const getDriverLocation = async (req, res) => {
  try {
    const destLocation = req.body.destAddress;
    const longitude = destLocation.x;
    const latitude = destLocation.y;
    const vehicleType = 'bicycle';
    var session = driver.session({
      database: "neo4j",
      defaultAccessMode: neo4j.session.READ,
    });

    const routeQuery = `
        MATCH (to:Restaurant)
        WHERE to.location.x = $longitude AND to.location.y = $latitude
        MATCH (to)-[:NEAREST_INTERSECTION]->(destination:Intersection)
        WITH destination
        MATCH (from:Rider{status: 'available', vehicleType: $vehicleType})-[:NEAREST_INTERSECTION]->(source:Intersection)
        WITH source, destination, collect(from) as sourceNodes
        UNWIND sourceNodes as s1
        CALL gds.shortestPath.dijkstra.stream('sanMateo', {
        sourceNode: source,
        targetNode: destination,
        relationshipWeightProperty: 'length'
        })
        YIELD index, sourceNode, targetNode, totalCost, nodeIds, costs, path
        RETURN 
            s1.id AS riderId,
            s1.name AS riderName,
            s1.location AS riderLocation, 
            destination.location AS restaurantAddress, 
            totalCost,
            [nodeId IN nodeIds | [gds.util.asNode(nodeId).location.x, gds.util.asNode(nodeId).location.y]] AS path
        ORDER BY totalCost
        LIMIT 1`;

    const result = await session.run(routeQuery, { longitude, latitude });
    const driverDetails = result.records.map(record => ({
      riderId: record.get("riderId"),
      riderName: record.get("riderName"),
      riderLocation: record.get("riderLocation"),
      restaurantAddress: record.get("restaurantAddress"),
      totalCost: record.get("totalCost"),
      path: record.get("path")
    }));

    session.close();
    res.status(201).json({
      success: true,
      data: driverDetails,
      message: "Delivery Agent Found"
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




module.exports = { getDriverLocation };