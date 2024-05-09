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

  constructor(private http: HttpClient) {}

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

  onPreparingFoodClicked(customerIndex: number, itemIndex: number) {
    this.buttonStates[customerIndex][itemIndex] =
      !this.buttonStates[customerIndex][itemIndex];
  }

  formatOrderItems(orderItems: any[]): string {
    return orderItems
      .map((item) => `${item.dish}: ${item.quantity}`)
      .join(", ");
  }
}
