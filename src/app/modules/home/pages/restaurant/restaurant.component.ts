import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-restaurant",
  templateUrl: "./restaurant.component.html",
  styleUrls: ["./restaurant.component.css"],
})
export class RestaurantComponent {
  customerList: any;
  buttonStates: boolean[][] = [];
  panelOpenState = false;
  restaurants: any;
  readyForPickup:boolean=false;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http
      .get<any[]>("http://localhost:3001/api/getRestaurants/orders")
      .subscribe((pendingOrders) => {
        this.customerList = pendingOrders;
        console.log(this.customerList);
        this.createOrderCart();
      });
  }

  createOrderCart() {
    console.log(this.customerList);

    this.customerList.forEach((customer: any) => {
      const states: boolean[] = [];
      customer.orderArray.forEach((item: any) => {
        states.push(false);
      });
      this.buttonStates.push(states);
      console.log(this.buttonStates);
    });
  }

  onPreparingFoodClicked(restaurantIndex: number, orderIndex: number, order: any) {
    const statusBool = this.buttonStates[restaurantIndex][orderIndex];
    if (statusBool) {
      this.updateStatus(order, "Preparing Food")
      
      this.buttonStates[restaurantIndex][orderIndex] =
        !this.buttonStates[restaurantIndex][orderIndex];
      
    }
    else {
      this.updateStatus(order, "Ready For Pickup")
    }


  }

  updateStatus(order: any, status: string) {

    let statusUpdateObj = {
      "orderId": order.orderId,
      "customerName": order.customerName,
      "customerId": order.customerId,
      "orderStatus": status,
    }
    this.http.post('http://localhost:3001/api/order/status/update', statusUpdateObj).subscribe(
      (data) => {
        console.log("Status updated " + status)
        if(status==="Ready For Pickup")
          {
            this.readyForPickup=true;
          }
      },
      (error) => {
        console.error('Error updating order status:', error);
      }
    );




  }

  formatOrderItems(orderItems: any[]): string {
    return orderItems
      .map((item) => `${item.dish}: ${item.quantity}`)
      .join(", ");
  }
}
