const express= require ('express');
const { getDriverLocation } = require ('../controllers/allocateRider');

const router = express.Router();
router.post("/allocateRider", getDriverLocation);

module.exports=router;