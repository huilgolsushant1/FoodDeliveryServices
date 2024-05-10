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
  status: boolean = true;
  code: any = true;
  isOutForDelivery: boolean = false
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

  callUpdateStatus(status: string, order: any) {
    if(status == 'Preparing Food') {
      this.status = false;
      this.updateStatus(order, status)
    }
    else {
      this.updateStatus(order, status)
    }
  }

  verifyCode(code:any, status: string, order: any) {
    this.updateStatus(order, status, code)
  }

  updateStatus(order: any, status: string, code?: any) {

    let statusUpdateObj:any = {
      "orderId": order.orderId,
      "customerName": order.customerName,
      "customerId": order.customerId,
      "orderStatus": status,
    }

    if(code) {
      statusUpdateObj.pickUpCode = code
    }
    this.http.post('http://localhost:3001/api/order/status/update', statusUpdateObj).subscribe(
      (res: any) => {
        if(res.message == 'Pickup code invalid')
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
