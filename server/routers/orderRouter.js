const express= require ('express');
const { placeTheOrder, checkPrice, updateStatus, fetchOrderStatus } = require ('../controllers/orderController.js');


const router = express.Router();

router.post("/confirm", placeTheOrder);
router.post("/checkprice", checkPrice);
router.post("/status/update", updateStatus);
router.post("/status/getStatus", fetchOrderStatus)
module.exports=router;