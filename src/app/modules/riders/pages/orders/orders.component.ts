import { Component, EventEmitter, OnInit } from '@angular/core';
import * as L from "leaflet";
import { Icon, icon, Marker } from "leaflet";
import 'leaflet-routing-machine';
import { RidersService } from "../../../share/service/riders.service"
import { RidersModule } from '../../riders.module';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

const customMarker = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40]
});

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {


  constructor(private http: HttpClient, private ridersService: RidersService, private route: ActivatedRoute) {
    //   this.orderDetails={
    //     "restaurantName":"Paakashala",
    //     "restaurantAddress":"201 S DELAWARE AVE # B, SAN MATEO, 94401",
    //     "orderId":"#1234",
    //     "orderItems":[{
    //       "dish":"Waffles",
    //       "price":"123",
    //       "quantity":2
    //     },
    //     {
    //       "dish":"Waffles",
    //       "price":"123",
    //       "quantity":2
    //     }],
    //     "orderStatus":"readyForPickup"
    //   }
    //  }
  }

  orderDetails: any;
  statusToBeUpdated: string = "";
  map: any;

  items: string[] = [];
  selected: string = "";

  filteredItems: string[] = [];
  showDropdown: boolean = false;
  restaurant: string = "NUTRICION CELLULAR"
  restaurantToDest: any;
  riderId: number = 0;



  ngOnInit() {

    this.route.params.subscribe(params => {
      this.riderId = params['id']; // Retrieve route parameter
    });
    this.http.get<any[]>(`http://localhost:3001/api/riders/order?riderId=${this.riderId}`).subscribe(
      (data) => {
        this.orderDetails = data?.[0];
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );

    Marker.prototype.options.icon = this.defaultIcon;

    this.map = L.map("map").setView([37.563434, -122.322255], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // L.Routing.control({
    //   waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)],
    //   routeWhileDragging: true
    // }).addTo(this.map);
    if (this.orderDetails?.orderStatus === "Ready For Pickup") {
      console.log("this.orderDetails?.orderStatus")
      this.statusToBeUpdated = "Out For Delivery"
    }
    else if (this.orderDetails?.orderStatus === "Out For Delivery") {
      this.statusToBeUpdated = "Delivered"
    }

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

  // Override default Icons
  private defaultIcon: Icon = icon({
    iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png"
  });

  calculateRouteAndPrice() {
    if (this.selected && this.restaurant) {
      this.ridersService.getRoute(this.restaurant, this.selected).subscribe((result: any) => {
        console.log(result);
        if (result?.success && result?.data && result?.data) {
          this.restaurantToDest = result?.data[0].path;
          // L.Routing.control({
          //   waypoints: this.restaurantToDest,
          //   routeWhileDragging: true
          // }).addTo(this.map);

          var polyline = L.polyline(this.restaurantToDest)
            .setStyle({ color: "red", weight: 7 })
            .addTo(this.map);

          console.log(this.restaurantToDest[0])
          console.log(this.restaurantToDest[this.restaurantToDest.length - 1])

          var corner1 = L.latLng(this.restaurantToDest[0][0], this.restaurantToDest[0][1]),
            corner2 = L.latLng(this.restaurantToDest[this.restaurantToDest.length - 1][0], this.restaurantToDest[this.restaurantToDest.length - 1][1])

          L.marker(corner1).addTo(this.map);
          L.marker(corner2).addTo(this.map);

          let bounds = L.latLngBounds(corner1, corner2);
          this.map.panInsideBounds(bounds)
          // L.polyline(this.restaurantToDest, { color: 'blue' }).addTo(this.map);

        }
      })

    }
  }


  updateStatus() {

    let statusUpdateObj = {
      "orderId": this.orderDetails.orderId,
      "customerName": this.orderDetails.customerName,
      "customerId": this.orderDetails.customerId,
      "orderStatus": this.statusToBeUpdated,
      "riderId": this.orderDetails.rider.riderId,
      "deliveryCode": null
    }
    if (this.statusToBeUpdated.toLowerCase() == "delivered") {
      statusUpdateObj.deliveryCode = this.orderDetails.deliveryCode;

      this.http.post('http://localhost:3001/api/order/status/update', statusUpdateObj).subscribe(
        (data) => {
          this.statusToBeUpdated = "";
          this.orderDetails.orderStatus="Delivered";
        },
        (error) => {
          console.error('Error updating order status:', error);
        }
      );
    }
    else
    {
  
        this.http.post('http://localhost:3001/api/status/update', statusUpdateObj).subscribe(
          (data) => {
            this.statusToBeUpdated = "Delivered";
            this.orderDetails.orderStatus="Out For Delivery";
          },
          (error) => {
            console.error('Error updating order status:', error);
          }
        );
      
    }


  }

}
