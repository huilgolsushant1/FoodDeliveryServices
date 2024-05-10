import { Component, EventEmitter, OnInit } from '@angular/core';
import * as L from "leaflet";
import { Icon, icon, Marker } from "leaflet";
import 'leaflet-routing-machine';
import { RidersService } from "../../../share/service/riders.service";

const customMarker = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40]
});

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  orderDetails: any;
  statusToBeUpdated:string="";
  map: any;

  items: string[] = [];
  selected: string = "";

  filteredItems: string[] = [];
  showDropdown: boolean = false;
  restaurant: string = "NUTRICION CELLULAR"
  restaurantToDest: any;
  shortestPath: any;
  constructor(private ridersService: RidersService)
  {}

   ngOnInit() {
    const temp = history.state.res;
    this.orderDetails = temp.data.orderDetails;
    this.shortestPath = temp.data.shortestPaths[0][0];
    
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


  updateStatus()
  {

  }

  }
