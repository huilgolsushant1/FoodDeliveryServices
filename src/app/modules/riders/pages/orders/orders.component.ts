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

  }

  orderDetails: any;
  shortestPath:any;
  map: any;

  items: string[] = [];
  selected: string = "";

  filteredItems: string[] = [];
  showDropdown: boolean = false;
  restaurant: string = "";
  restaurantToDest: any;
  riderId: number = 0;
  isOutForDelivery:boolean=false;
  code: any = true;


  ngOnInit() {

    this.route.params.subscribe(params => {
      this.riderId = params['id']; // Retrieve route parameter
    });
    this.http.get<any[]>(`http://localhost:3001/api/riders/order?riderId=${this.riderId}`).subscribe(
      (data:any) => {
        this.orderDetails = data?.orderDetails;
        this.shortestPath = data?.shortestPaths[0][0];
        if(this.orderDetails?.orderStatus === "Out For Delivery"){
          this.isOutForDelivery=true;
          this.startRouting()
        }
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

 
  startRouting() {
    let startPoint = this.shortestPath.path[0];
    let endPoint = this.shortestPath.path[this.shortestPath.path.length - 1];    
    
    var polyline = L.polyline(this.shortestPath.path)
          .setStyle({ color: "red", weight: 7 })
          .addTo(this.map);

          const restaurant = L.icon({
            iconUrl: 'assets/restaurant.png',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
          });

          const customer = L.icon({
            iconUrl: 'assets/customer.png',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
          });
      
          const bicycle = L.icon({
            iconUrl: 'assets/bicycle.png',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
          });
      
          const bike = L.icon({
            iconUrl: 'assets/bike.png',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
          });
      
          const car = L.icon({
            iconUrl: 'assets/car.png',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
          });

          var corner1 = L.latLng(startPoint[0], startPoint[1]),
          corner2 = L.latLng(endPoint[0], endPoint[1])
          
           L.marker(corner1, { icon: restaurant }).addTo(this.map);
           L.marker(corner2, { icon: customer }).addTo(this.map);
           var marker = L.marker(corner1, { icon: bike }).addTo(this.map);
          
          let bounds = L.latLngBounds(corner1, corner2);
          this.map.panInsideBounds(bounds)

          this.shortestPath.path.forEach(function (coord:any, index:any) {
            setTimeout(function () {
            marker.setLatLng([coord[0], coord[1]]);
          }, 1000 * index)
        })
  }


  updateStatus() {

    let statusUpdateObj = {
      "orderId": this.orderDetails.orderId,
      "customerName": this.orderDetails.customerName,
      "customerId": this.orderDetails.customerId,
      "orderStatus": "Delivered",
      "riderId": this.orderDetails.rider.riderId,
      "deliveryCode": this.code
    }
      statusUpdateObj.deliveryCode = this.orderDetails.deliveryCode;

      this.http.post('http://localhost:3001/api/order/status/update', statusUpdateObj).subscribe(
        (data) => {
          this.orderDetails.orderStatus="Delivered";
        },
        (error) => {
          console.error('Error updating order status:', error);
        }
      );
    }

  }
  


