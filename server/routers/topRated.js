const express= require ('express');
const { topBudgetRestaurantsController } = require('../controllers/topBudgetController');
const { topRatedRestaurantsController } = require('../controllers/topRatedRestaurantsController');
const { getCuisineRestaurantsController } = require('../controllers/getCuisineRestaurantsController');

const topRatedRouter = express.Router();

// top rated budget friendly restaurants
topRatedRouter.get("/restaurants", topBudgetRestaurantsController);

//Top rated nearby restaurants
topRatedRouter.get('/top-rated-restaurants', topRatedRestaurantsController);

//Top rated cuisine based restaurants
topRatedRouter.get("/cuisineRestaurants", getCuisineRestaurantsController);


module.exports=topRatedRouter;