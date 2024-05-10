import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Neo4jService } from 'src/app/neo4j.service';

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
  ordersData: any;

  constructor(private http: HttpClient, 
    private route: ActivatedRoute, 
    private neo4jService: Neo4jService,
    private router: Router) { }

  ngOnInit(): void {
    this.ordersData = JSON.parse(sessionStorage.getItem('orderData') || '{}');
    console.log(this.ordersData);
    this.cart = this.ordersData.data.orderDetails.orderedItems;
    this.cartTotal = this.ordersData.data.orderDetails.totalPrice;
    this.fetchRestaurants();
  }

  fetchRestaurants() {
    this.http.get<any[]>('http://localhost:3001/api/getRestaurants/restaurants')
      .subscribe(restaurants => {
        this.restaurants = restaurants.map(restaurant => {
          return { id: restaurant.id, name: restaurant.name, dishes: restaurant.dishes };
        });
      });
  }

  fetchDishesByRestaurantId(event: any) {
    const restaurantId = event.target.value;
    this.selectedRestaurant = this.restaurants.find(restaurant => restaurant.id === restaurantId);
    this.selectedRestaurantDishes = this.selectedRestaurant.dishes;
  }

  addToCart() {
    const selectedDish = this.selectedRestaurantDishes.find(dish => dish.dish === this.selectedDish);
    if (selectedDish) {
      this.cart.push(selectedDish);
      this.calculateCartTotal();
    }
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.calculateCartTotal();
  }

  calculateCartTotal() {
    this.cartTotal = this.cart.reduce((total, item) => total + item.price, 0);
  }

  placeOrder() {
    this.ordersData.data.orderDetails.totalPrice = this.cartTotal + this.ordersData.data.orderDetails.rider.deliveryCharge;
    this.neo4jService.placeOrder(this.ordersData).subscribe(res => {
      this.router.navigate(['/checkout'], { state: { res } });
    })
  }
}
