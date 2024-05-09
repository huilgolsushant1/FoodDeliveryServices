const express= require ('express');
const { getDriverLocation } = require ('../controllers/allocateRider');

const router = express.Router();
router.post("/allocateRider", getDriverLocation);
router.post("/", async(req, res)=>{
    
});

module.exports=router;