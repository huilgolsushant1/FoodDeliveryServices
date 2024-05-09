const express= require ('express');
const { topBudgetRestaurantsController } = require('../controllers/topBudgetController');
const { topRatedRestaurantsController } = require('../controllers/topRatedRestaurantsController');
const { getCuisineRestaurantsController } = require('../controllers/getCuisineRestaurantsController');

const topRatedRouter = express.Router();

// top rate budget friendly restaurants
topRatedRouter.get("/restaurants", topBudgetRestaurantsController);
// topRatedRouter.get("/influenc", topRatedRestaurantsController);

topRatedRouter.get('/top-rated-restaurants', topRatedRestaurantsController);
topRatedRouter.get("/cuisineRestaurants", getCuisineRestaurantsController);


module.exports=topRatedRouter;