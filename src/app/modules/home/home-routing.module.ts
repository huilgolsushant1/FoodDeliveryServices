import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { FoodDetailsComponent } from './pages/food-details/food-details.component';
import { FoodsCartComponent } from './pages/foods-cart/foods-cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { RestaurantComponent } from './pages/restaurant/restaurant.component';

const routes: Routes = [
  {
    path:'',
    component:DefaultLayoutComponent,
    children:[
      {
        path:'details/:id',
        component:FoodDetailsComponent
      },
      {
        path:'cart',
        component:FoodsCartComponent
      },
      {
        path:'checkout',
        component:CheckoutComponent
      },
      {
        path:'restaurant',
        component:RestaurantComponent
      },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
