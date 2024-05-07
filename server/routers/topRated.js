const express= require ('express');
const { topBudgetRestaurantsController } = require('../controllers/topBudgetController');

const topBudgetController = express.Router();

topBudgetController.get("/restaurants", topBudgetRestaurantsController);
// topRatedRouter.get("/influenc", topRatedRestaurantsController);

module.exports=topBudgetController;