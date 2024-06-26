const express = require("express");
const cors = require("cors");
const dbConnections = require("./database.js");
const pathCalculationRoutes = require("./routers/pathCalculationRouter.js");
const getRestaurantsRouter = require("./routers/getRestaurants.js");
const bodyParser = require("body-parser");
const topRatedRouter = require("./routers/topRated.js");
const getWeatherRouter = require("./routers/getWeather.js");
const orderRouter = require("./routers/orderRouter.js");
const riderRouter = require("./routers/riderRouter.js");
const { mongoClient, redisClient, connectRedisDB } = require('./database.js');
const getCustomerRouter = require("./routers/getCustomers.js")

const app = express();
const port = process.env.PORT;

connectRedisDB();
dbConnections.connectMongoDB();
const neo4jClient=dbConnections.neo4jClient;
// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Router
app.use("/api/path", pathCalculationRoutes);
app.use("/api/getRestaurants", getRestaurantsRouter);
app.use("/api/order", orderRouter );

app.use("/api/topRated", topRatedRouter);
app.use("/api/getCustomers", getCustomerRouter);
app.get("/api/addresses",  async (req, res)=>{
    try{
        const session = dbConnections.neo4jClient.session(); 
        const searchString=req.query.searchString;
        const result = await session.readTransaction(async tx => { // Begin a read transaction
            const query = `
                 CALL 
            db.index.fulltext.queryNodes("search_index", $searchString) 
            YIELD node, score
            RETURN  coalesce(node.name, node.full_address) as fullAddress
            ORDER BY score DESC LIMIT 25
            `;
            const queryResult = await tx.run(query,{searchString:searchString});
            return queryResult.records.map(record => {
                return record.get('fullAddress');
            });
        });
        session.close(); // Close the session
        res.json(result);
    }
    catch(error)
    {
        console.error('Error fetching data from Neo4j:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.use("/api/riders", riderRouter);

app.post('/api/cache', async (req, res) => {
  try{
          
       const customerDetails=req.body;
       const redisCustomerKey=(Buffer.from(customerDetails.name.toLowerCase().trim().replace(' ', '') + customerDetails.id).toString('base64'))
       await redisClient.set(redisCustomerKey, JSON.stringify(customerDetails));
        console.log("Customer Cache Set")
        res.status(200).json({ message: "Customer Cache Set" })
  }
  catch(e)
  {
    console.log(e)
    res.status(500).json({ error: "Internal server error" });

  }
})


//Top Influencer picks api
app.get('/api/banners/getTop5', async (req, res) => {
    try {
        const session = dbConnections.neo4jClient.session(); 
        const result = await session.readTransaction(async tx => { 
            const query = `
                MATCH (r:Restaurant)<-[rev:REVIEWED]-(c:Customer)
                WHERE toInteger(c.totalFollowers) > 200
                WITH r, round(avg(rev.rating) * 10) / 10 AS avgRating, count(rev) AS influencerVisits
                WHERE avgRating >= 3.5
                RETURN
                {
                    restaurantDetails: r,
                    name: r.name,
                    influencerVisits: influencerVisits,
                    avgRating: avgRating
                } AS result
                ORDER BY influencerVisits DESC
                LIMIT 5
            `;
      const queryResult = await tx.run(query);
      return queryResult.records.map((record) => {
        const { restaurantDetails, name, influencerVisits, avgRating } =
          record.get("result");
        return { restaurantDetails, name, influencerVisits, avgRating };
      });
    });
    session.close(); 
    res.json(result);
  } catch (error) {
    console.error("Error fetching data from Neo4j:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Cuisine & dish api 
app.get("/api/banners/getAdditionalDetails/:id", async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const db = mongoClient.db("FoodDeliveryService");
    const collection = db.collection("restaurants");
    const restaurants = await collection.find({
        id: restaurantId
    }).toArray();
    res.json(restaurants);
} catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
}
});

// Reviews api
app.get("/api/banners/getReviews/:id", async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const session = dbConnections.neo4jClient.session();
    const result = await session.readTransaction(async (tx) => {
      const query = `
                MATCH (c:Customer)-[r:REVIEWED]->(res:Restaurant {id: $restaurantId})
                WITH c, COLLECT({review: r.review, rating: r.rating}) AS reviews
                RETURN {
                    customerdetails: c,
                    reviews: reviews,
                    isInfluencer: CASE
                        WHEN toInteger(c.totalFollowers) > 200 THEN true
                        ELSE false
                    END
                } AS result
            `;
      const queryResult = await tx.run(query, {
        restaurantId: parseInt(restaurantId),
      });
      return queryResult.records.map((record) => {
        const { customerdetails, reviews, isInfluencer } = record.get("result");
        return { customerdetails, reviews, isInfluencer };
      });
    });
    session.close();
    res.json(result);
  } catch (error) {
    console.error("Error fetching data from Neo4j:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Average cost for two api
app.get("/api/banners/getAvgCostForTwo/:id", async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const session = dbConnections.neo4jClient.session(); 
    const result = await session.readTransaction(async tx => { 
      const query = `
        MATCH (r:Restaurant {id: $restaurantId})<-[rev:REVIEWED]-()
        WHERE rev.costForTwo IS NOT NULL
        WITH avg(rev.costForTwo) AS avgCostForTwo
        RETURN {cost: toInteger(avgCostForTwo)} AS avgCostForTwo
      `;
      const queryResult = await tx.run(query, {
        restaurantId: parseInt(restaurantId),
      });
      return queryResult.records.map((record) => record.get("avgCostForTwo"));
    });
    session.close();
    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching data from Neo4j:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use((err, req, res, next) => {
    console.error(err);
    res.sendStatus(500);
})

// process.on("exit", function(){
//   redisClient.quit();
// });
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
