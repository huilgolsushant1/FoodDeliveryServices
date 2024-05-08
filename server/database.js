const neo4j = require('neo4j-driver');
const mongoose = require('mongoose');
const path = require("path");
const dotenv=require("dotenv");
dotenv.config({path:path.join(__dirname, "./.env")});
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URL;
const { createClient } = require('redis');
const { promisify } = require('util');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

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

const neo4jClient = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD))


const redisClient = createClient({
  password: 'VOCTYVir9slBSjvdvZK6p6y6a2Mxu13B',
  socket: {
      host: 'redis-10637.c311.eu-central-1-1.ec2.redns.redis-cloud.com',
      port: 10637
  }
});

// Promisify client.get function
redisClient.getAsync = promisify(redisClient.get).bind(redisClient);

redisClient.connect();

redisClient.on('connect', () => {
  console.log('Connected to Redis server');
});

redisClient.on('error', (error) => {
  console.error('Not connected -------------',error);
});


module.exports = {connectMongoDB, neo4jClient, mongoClient, redisClient};





// async function setOrder(code, order) {
//     try {
//         await client.set(String(code), JSON.stringify(order));
//         // Other subsequent lines can go here
//         return 'Order successfully set!';
//     } catch (error) {
//         console.error('Error setting order in Redis:', error);
//         throw error;
//     }
// }

// module.exports = {
//   setOrder: (code, order) => {
//     setOrder(code, order);
//   },

//   getOrder: async (code) => {
//     return await client.get(String(code));
//   },
  
//   updateOrderStatus: async (code, status) => {
//      var order = await client.get(String(code));
//      if(order) {
//       order = JSON.parse(order);
//       order.status = status;
//       return await client.set(String(code), JSON.stringify(order))
//      }
//   }
// };