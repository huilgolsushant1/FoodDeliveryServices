import { Component } from "@angular/core";

@Component({
  selector: "app-restaurant",
  templateUrl: "./restaurant.component.html",
  styleUrls: ["./restaurant.component.css"],
})
export class RestaurantComponent {
  customerList = [
    {
      restaurantName: "HOTEL TAJ",
      cartArray: [
        {
          customerName: "Prem Patil",
          orderNumber: 12234,
          orderedItems: "masala dosa(1),jira rice(2)",
        },
        {
          customerName: "Kalpesh Patil",
          orderNumber: 12234,
          orderedItems: "masala dosa(1),jira rice(2)",
        },
      ],
    },
    {
      restaurantName: "HOTEL KRISHNA",
      cartArray: [
        {
          customerName: "Rahul Patil",
          orderNumber: 12234,
          orderedItems: "masala dosa(1),jira rice(2)",
        },
        {
          customerName: "Vedant Patil",
          orderNumber: 12234,
          orderedItems: "masala dosa(1),jira rice(2)",
        },
      ],
    },
    {
      restaurantName: "EXPRESS INN",
      cartArray: [
        {
          customerName: "Kalyani Patil",
          orderNumber: 12234,
          orderedItems: "masala dosa(1),jira rice(2)",
        },
        {
          customerName: "Pooj Patil",
          orderNumber: 12234,
          orderedItems: "masala dosa(1),jira rice(2)",
        },
      ],
    },
  ];

  buttonStates: boolean[][] = [];
  panelOpenState = false;

  constructor() {}

  ngOnInit() {
    this.customerList.forEach((customer) => {
      const states: boolean[] = [];
      customer.cartArray.forEach((item) => {
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
}
