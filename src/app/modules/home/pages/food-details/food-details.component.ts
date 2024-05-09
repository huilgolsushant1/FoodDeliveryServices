import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Neo4jService } from "../../../../neo4j.service";
import { RidersService } from "src/app/modules/share/service/riders.service";

@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.component.html',
  styleUrls: ['./food-details.component.css'],
})
export class FoodDetailsComponent implements OnInit {
  restaurant: any;
  getAdditionalRestaurantData: any;
  restaurantId: any;
  influencersReviews: any;
  nonInfluencersReviews: any;
  cuisine: any;
  dishes: any;
  getAvgCostForTwo: any;
  collapsedSections: any = {}; // Object to track collapsed sections
  totalPrice: number = 0;
  items: string[] = [];
  selected: string = "";
  showDropdown: boolean = false;
  filteredItems: string[] = [];

  customerData: any;
  orderData: any;

  orderSample = {
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
    "totalPrice":"200",
    "customerName":"Kalesh Patil",
    "deliveryAddress":"Kalesh's Cross"
}
  
  constructor(
    private neo4jService: Neo4jService,
    private route: ActivatedRoute,
    private ridersService: RidersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.restaurant = history.state.restaurant;
    this.customerData = JSON.parse(sessionStorage.getItem('customer') || '{}');
    console.log(this.customerData);
    
    this.restaurantId = this.restaurant.restaurantDetails.properties.id.low;
    this.getReviews();
    this.getAdditionalDetails();
    this.getAverageCostForTwo();
  }

  getReviews() {
    this.neo4jService.getReviews(this.restaurantId).subscribe(
      (data) => {
        const separatedReviews = data.reduce(
          (acc, item) => {
            item.isInfluencer
              ? acc.influencers.push(item)
              : acc.nonInfluencers.push(item);
            return acc;
          },
          { influencers: [], nonInfluencers: [] }
        );
        this.influencersReviews = separatedReviews.influencers;
        this.nonInfluencersReviews = separatedReviews.nonInfluencers;
        console.log(
          "Data from separatedReviews (influencers):",
          separatedReviews.influencers
        );
        console.log(
          "Data from separatedReviews (non-influencers):",
          separatedReviews.nonInfluencers
        );
      },
      (error) => {
        console.error("Error fetching data from Neo4j:", error);
      }
    );
  }

  getAdditionalDetails() {
    this.neo4jService.getAdditionalDetails(this.restaurantId).subscribe(
      (data) => {
        this.dishes = data[0].dishes;
        this.dishes.forEach((dish: any) => {
          dish.quantity = 0;
        });
        this.cuisine = [...new Set(this.dishes.map((dish: { cuisine: any; }) => dish.cuisine))];
      },
      (error) => {
        console.error("Error fetching data from Neo4j:", error);
      }
    );
  }

  getAverageCostForTwo() {
    this.neo4jService.getAvgCostForTwo(this.restaurantId).subscribe(
      (data: any) => {
        this.getAvgCostForTwo = data?.cost?.low;
      },
      (error) => {
        console.error("Error fetching data from Neo4j:", error);
      }
    );
  }

  toggleCollapse(section: string) {
    this.collapsedSections[section] = !this.collapsedSections[section];
  }

  decrementQuantity(item: any) {
    if (item.quantity > 0) {
      item.quantity--;
      this.totalPrice = this.totalPrice - item.price;
    }
  }

  incrementQuantity(item: any) {
    item.quantity++;
    this.totalPrice = this.totalPrice + item.price;
  }

  getOrderItems() {
    let orderedItems: any = [];
    this.dishes.forEach((dish: any) => {
      if(dish.quantity > 0) {
        orderedItems.push(dish);
      }
    });
    return orderedItems;
  }

  viewCart() {
    this.createObject();
  }

  onInput(event: any) {

    if (event.target.value) {
      this.ridersService.fetchDeliveryAddresses(event.target.value).subscribe((result: any) => {

        this.filteredItems = result;
      })
      this.showDropdown = true;
    } else {
      this.filteredItems = [];
      this.showDropdown = false;
    }
  }

  selectItem(item: string) {
    this.selected = item;
    this.showDropdown = false;
  }
  clearSelection() {
    this.selected = ""; // Reset the selected item
    this.showDropdown = false; // Hide the dropdown
  }

  createObject() {
    // this.orderData = {
    //   "restaurantId": this.restaurantId,
    //   "restaurantName": this.restaurant.name,
    //   "totalPrice": this.totalPrice,
    //   "orderedItems": this.getOrderItems(),
    //   "customerName": this.customerData.name,
    //   "customerId": this.customerData.id,
    //   "deliveryAddress":  this.selected,
    // }
    this.orderSample.deliveryAddress = this.selected;
    this.orderSample = this.orderSample;
    sessionStorage.setItem('orderData', JSON.stringify(this.orderSample));
    this.router.navigate(['/cart']);
  }

}
