import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-foods-cart',
  templateUrl: './foods-cart.component.html',
  styleUrls: ['./foods-cart.component.css']
})
export class FoodsCartComponent implements OnInit {
  restaurants: any[] = [];
  selectedRestaurant: any;
  selectedRestaurantDishes: any[] = [];
  selectedDish: any;
  cart: any[] = [];
  cartTotal: number = 0;
  ridersCount: number = 0;
  pendingOrders: number = 40;
  demand: number = 0;

  constructor(private http: HttpClient) { }

  async ngOnInit(): Promise<void> {
    await this.fetchRestaurants();
    await this.getAvailableRidersCount();
    this.calculateDemand();
  }

  async fetchRestaurants(): Promise<void> {
    const restaurants = await this.http.get<any[]>('http://localhost:3001/api/getRestaurants/restaurants').toPromise();
    if (restaurants) {
      this.restaurants = restaurants.map(restaurant => {
        return { id: restaurant.id, name: restaurant.name, dishes: restaurant.dishes };
      });
    }
  }

  fetchDishesByRestaurantId(event: any): void {
    const restaurantId = event.target.value;
    this.selectedRestaurant = this.restaurants.find(restaurant => restaurant.id === restaurantId);
    this.selectedRestaurantDishes = this.selectedRestaurant?.dishes || []; // Nullish coalescing operator used here
  }

  addToCart(): void {
    const selectedDish = this.selectedRestaurantDishes.find(dish => dish.dish === this.selectedDish);
    if (selectedDish) {
      this.cart.push(selectedDish);
      this.calculateCartTotal();
    }
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    this.calculateCartTotal();
  }

  calculateCartTotal(): void {
    this.cartTotal = this.cart.reduce((total, item) => total + item.price, 0);
  }

  async getAvailableRidersCount(): Promise<void> {
    const riders = await this.http.get<any[]>('http://localhost:3001/api/getRestaurants/riders').toPromise();
    if (riders) {
      this.ridersCount = riders.filter(rider => rider.status === 'available').length;
      console.log('Available Riders Count:', this.ridersCount);
    }
  }

  calculateDemand(): void {
    this.demand = this.pendingOrders / this.ridersCount;
    console.log('Demand:', this.demand);
  }
}
