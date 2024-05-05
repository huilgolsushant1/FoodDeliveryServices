const express = require('express')
const cors=require('cors');
const dbConnections=require('./database.js')
const pathCalculationRoutes =require("./routers/pathCalculationRouter.js");
const getRestaurantsRouter = require("./routers/getRestaurants.js");

const bodyParser=require("body-parser");

const app = express();

const port = process.env.PORT;

dbConnections.connectMongoDB();

// Middleware
app.use(express.json());
app.use(
  cors()
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Router
app.use("/api/path", pathCalculationRoutes);
app.use("/api/getRestaurants", getRestaurantsRouter);


app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})