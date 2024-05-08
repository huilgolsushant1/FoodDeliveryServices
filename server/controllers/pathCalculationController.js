const express = require('express');
const router = express.Router();
const { neo4jClient } = require('../database.js')
const neo4j = require('neo4j-neo4jClient');
const { getTotalRouteTimeforMultipleRoutes } =require('./modeOfTransportController.js')


const calculateShortestPath = async (req, res) => {
  try {
    const sourceAddress = req.body.sourceAddress;
    const destAddress = req.body.destAddress;
    console.log(sourceAddress)
    console.log(destAddress)
    var session = neo4jClient.session({
      database: "neo4j",
      defaultAccessMode: neo4j.session.READ,
    });

    const routeQuery = `
    MATCH (to:Address{full_address: $destAddress})-[:NEAREST_INTERSECTION]->(source:Intersection) 
    MATCH (from:Restaurant{name: $sourceAddress})-[:NEAREST_INTERSECTION]->(target:Intersection) 
    CALL gds.shortestPath.yens.stream('sanMateo',{sourceNode: source, targetNode: target, k: 3, relationshipWeightProperty: 'length'})
    YIELD index, sourceNode, targetNode, totalCost, nodeIds, costs, path
    RETURN index, totalCost,
    [nodeId IN nodeIds | [   gds.util.asNode(nodeId).location.latitude, gds.util.asNode(nodeId).location.longitude]] AS path
    ORDER BY index`;

    let shortestPaths = []; 
    let oneShortestPath;

    session
      .run(routeQuery, { sourceAddress, destAddress })
      .subscribe({
        onNext: records => {
          shortestPaths.push({"distance":records.get("totalCost"),"path":records.get("path")}); 

        },
        onCompleted: async () => {
          session.close();
          oneShortestPath=await getTotalRouteTimeforMultipleRoutes(shortestPaths, "motorcycle")
          console.log(oneShortestPath)
          res.status(201).json({
            success: true,
            data: oneShortestPath,
            message: "Shortest Paths Calculated"
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



module.exports = { calculateShortestPath };