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
  status: string = 'confirmed';
  code: any = true;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http
      .get<any[]>("http://localhost:3001/api/getRestaurants/orders")
      .subscribe((pendingOrders) => {
        this.customerList = pendingOrders;
        this.createOrderCart();
      });
  }

  createOrderCart() {
    this.customerList.forEach((customer: any) => {
      const states: boolean[] = [];
      customer.orderArray.forEach((item: any) => {
        states.push(false);
      });
      this.buttonStates.push(states);
    });
  }

  callUpdateStatus(status: string, order: any) {
    if(status == 'Preparing Food') {
      this.status = status;
      this.updateStatus(order, status)
    }
    else {
      this.status = status;
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
        else if(status == 'Out For Delivery' && res.message == 'Order Status Updated!') {
          this.status = 'Out For Delivery';
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
