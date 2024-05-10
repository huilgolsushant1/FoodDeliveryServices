const express = require('express');
const router = express.Router();
const { neo4jClient } = require('../database.js')
const neo4j = require('neo4j-driver');
const { getTotalRouteTimeforMultipleRoutes } =require('./modeOfTransportController.js')


const calculateShortestPath = async (restaurantName, deliveryAddress) => {
  try {
    var session = neo4jClient.session({
      database: "neo4j",
      defaultAccessMode: neo4j.session.READ,
    });

    const routeQuery = `
    MATCH (to:Address{full_address: $deliveryAddress})-[:NEAREST_INTERSECTION]->(source:Intersection) 
    MATCH (from:Restaurant{name: $restaurantName})-[:NEAREST_INTERSECTION]->(target:Intersection) 
    CALL gds.shortestPath.yens.stream('sanMateo',{sourceNode: source, targetNode: target, k: 3, relationshipWeightProperty: 'length'})
    YIELD index, sourceNode, targetNode, totalCost, nodeIds, costs, path
    RETURN index, totalCost,
    [nodeId IN nodeIds | [   gds.util.asNode(nodeId).location.latitude, gds.util.asNode(nodeId).location.longitude]] AS path
    ORDER BY index`;


    const records = await session.run(routeQuery, { restaurantName, deliveryAddress });
    const shortestPaths = records.records.map(record => ({
      distance: record.get("totalCost"),
      path: record.get("path"),
    }));

    session.close();

    const totalTimePaths =  await getTotalRouteTimeforMultipleRoutes(shortestPaths, "car");
    return totalTimePaths;
    // shortestPaths[0].travelTime=20;
    // shortestPaths[1].travelTime=23;
    // shortestPaths[2].travelTime=25;

    // return shortestPaths;

  } catch (error) {
    console.log(error);
    // res.status(500).json({
    //   success: false,
    //   message: error.message
    // });
    return [];
  }
};



module.exports = { calculateShortestPath };