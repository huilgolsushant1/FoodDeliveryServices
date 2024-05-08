const { calculateShortestPath }=require('./pathCalculationController.js')
const { selectModeOfTransport }=require('./pathCalculationController.js')

const placeTheOrder = async (req, res) => 
{
    try{

    //   {
    //         "shortestPaths":[
    //             {
    //                 "path":[],
    //                 "distance":2345,
    //                 "totalTravelTime":30
    //             },
    //             {
    //                 "path":[],
    //                 "distance":2345,
    //                 "totalTravelTime":30
    //             },
    //             {
    //                 "path":[],
    //                 "distance":2345,
    //                 "totalTravelTime":30
    //             }
    //         ],
    //         "weather":"snowy",
    //         "orderDetails":{
    //             "orderId":"123",
    //             "restaurantId":123,
    //                       "restaurantName":"Kalesh's Corner",
    //             "orderedItems":[{
    //                 "dish":"Waffles - choco",
    //                 "price":"123",
    //                 "quantity":2
    //               },
    //               {
    //                 "dish":"Waffles - cherry",
    //                 "price":"123",
    //                 "quantity":2
    //               }
    //             ],
    //             "customerName":"Kalesh Patil",
    //             "deliveryAddress":"Kalesh's Cross",
    //             "totalPrice":2300,
    //             "rider":{
    //                 "riderId":"123",
    //                 "riderName":"Kalesh's Rider",
    //                 "modeOfTransport":"Car",
    //                 "deliveryCharge":"200"
    //             },
    //             "orderStatus":"Pending"
    //         }

    //     }

        const shortestPaths=[
            {
                "path":[],
                "distance":2345,
                "totalTravelTime":30
            },
            {
                "path":[],
                "distance":2345,
                "totalTravelTime":30
            },
            {
                "path":[],
                "distance":2345,
                "totalTravelTime":30
            }
        ];
        const weather="snowy";
        const orderDetails={
            "orderId":"123",
            "restaurantId":123,
  					"restaurantName":"Kalesh's Corner",
            "orderedItems":[{
                "dish":"Waffles - choco",
                "price":"123",
                "quantity":2
              },
              {
                "dish":"Waffles - cherry",
                "price":"123",
                "quantity":2
              }
            ],
            "customerName":"Kalesh Patil",
            "deliveryAddress":"Kalesh's Cross",
            "totalPrice":2300,
            "rider":{
                "riderId":"123",
                "riderName":"Kalesh's Rider",
                "modeOfTransport":"Car",
                "deliveryCharge":"200"
            },
            "orderStatus":"Pending"
        };

        //store this in redis key
        //add it to mongo db 
        //update rider status 
        //return order information
        
    }
    catch(e)
    {

    }
}