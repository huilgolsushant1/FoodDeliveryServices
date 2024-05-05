const express= require ('express');
const { calculateShortestPath } = require ('../controllers/pathCalculationController');

const router = express.Router();
// router.route("/add").post(addCategoryController);
// router.route("/getAllCategories").get(getAllCategories);
// router.route("/update").put(updateCategory);
// router.route("/delete").delete(deleteCategory);

router.get("/shortest", calculateShortestPath);

module.exports=router;