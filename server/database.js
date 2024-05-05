const neo4j = require('neo4j-driver');
const mongoose = require('mongoose');
const path = require("path");
const dotenv=require("dotenv");
dotenv.config({path:path.join(__dirname, "./.env")});
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD))



const connectMongoDB = async (req, res) => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  catch(e)
  {
    console.log(e)
  }
}
module.exports = {connectMongoDB, driver, client};