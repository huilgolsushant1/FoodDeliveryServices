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

  calculateRouteAndPrice() {
    if (this.selected && this.restaurant) {
      this.ridersService.getRoute(this.restaurant, this.selected).subscribe((result: any) => {
        if (result?.success && result?.data && result?.data) {
          this.restaurantToDest = result?.data[0].path;
          // L.Routing.control({
          //   waypoints: this.restaurantToDest,
          //   routeWhileDragging: true
          // }).addTo(this.map);

          var polyline = L.polyline(this.restaurantToDest)
          .setStyle({ color: "red", weight: 7 })
          .addTo(this.map);

          var corner1 = L.latLng(this.restaurantToDest[0][0], this.restaurantToDest[0][1]),
          corner2 = L.latLng(this.restaurantToDest[this.restaurantToDest.length-1][0], this.restaurantToDest[this.restaurantToDest.length-1][1])
          
           L.marker(corner1).addTo(this.map);
           L.marker(corner2).addTo(this.map);

          
          let bounds = L.latLngBounds(corner1, corner2);
          this.map.panInsideBounds(bounds)
         // L.polyline(this.restaurantToDest, { color: 'blue' }).addTo(this.map);

        }
      })

    }
  }

  startRouting() {
    let startPoint = this.shortestPath.path[0];
    let endPoint = this.shortestPath.path[this.shortestPath.path.length - 1];    
    
    var polyline = L.polyline(this.shortestPath.path)
          .setStyle({ color: "red", weight: 7 })
          .addTo(this.map);

          var corner1 = L.latLng(startPoint[0], startPoint[1]),
          corner2 = L.latLng(endPoint[0], endPoint[1])
          
           L.marker(corner1).addTo(this.map);
           L.marker(corner2).addTo(this.map);
           var marker = L.marker(corner1).addTo(this.map);
          
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
