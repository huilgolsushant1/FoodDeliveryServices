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

    let shortestPaths = []; 

    session
      .run(routeQuery, { restaurantName, deliveryAddress })
      .subscribe({
        onNext: records => {
          shortestPaths.push({"distance":records.get("totalCost"),"path":records.get("path")}); 

        },
        onCompleted: async () => {
          session.close();
          console.log("hi")
          shortestPaths=await getTotalRouteTimeforMultipleRoutes(shortestPaths, "motorcycle")
          // res.status(201).json({
          //   success: true,
          //   data: shortestPaths,
          //   message: "Shortest Paths Calculated"
          // });
          return shortestPaths;
        },
        onError: error => {
          console.log(error);
          session.close();
          return [];
        }
      });
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