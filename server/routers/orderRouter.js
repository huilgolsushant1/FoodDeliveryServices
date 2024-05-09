const express= require ('express');
const { placeTheOrder, checkPrice } = require ('../controllers/orderController.js');


const router = express.Router();

router.post("/confirm", placeTheOrder);
router.post("/checkprice", checkPrice);

module.exports=router;