const express = require('express');
const router = express.Router();
const { neo4jClient } = require('../database.js')
const neo4j = require('neo4j-driver');


const getDriverLocation = async (restaurantName, vehicleType) => {
  try {
    var session = neo4jClient.session({
      database: "neo4j",
      defaultAccessMode: neo4j.session.READ,
    });
    console.log('MOD', vehicleType)
    const routeQuery = `
        MATCH (to:Restaurant{name:$restaurantName})-[:NEAREST_INTERSECTION]->(destination:Intersection)
        WITH destination, to
        MATCH (from:Rider{status: 'available', vehicleType: $vehicleType})-[:NEAREST_INTERSECTION]->(source:Intersection)
        WITH source, destination, collect(from) as sourceNodes, to
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
            s1.vehicleType AS modeOfTransport,
            s1.location AS riderLocation, 
            to.address+", "+to.city+", "+to.zip AS restaurantAddress, 
            totalCost,
            [nodeId IN nodeIds | [gds.util.asNode(nodeId).location.latitude, gds.util.asNode(nodeId).location.longitude]] AS path
        ORDER BY totalCost
        LIMIT 1`;

    const result = await session.run(routeQuery, { restaurantName, vehicleType });
    const driverDetails = result.records.map(record => ({
      riderId: record.get("riderId"),
      riderName: record.get("riderName"),
      riderLocation: record.get("riderLocation"),
      restaurantAddress: record.get("restaurantAddress"),
      totalCost: record.get("totalCost"),
      path: record.get("path"),
      modeOfTransport: record.get("modeOfTransport")
    }));

    session.close();
    return driverDetails?.[0];
  } catch (error) {
    console.error("Error:", error);
    
  }
};




module.exports = { getDriverLocation };