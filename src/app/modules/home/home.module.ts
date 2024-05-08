import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { HomeRoutingModule } from "./home-routing.module";
import { DefaultLayoutComponent } from "./layout/default-layout/default-layout.component";
import { CarouselComponent } from "./components/carousel/carousel.component";
import { FoodDetailsComponent } from "./pages/food-details/food-details.component";
import { FooterComponent } from "./components/footer/footer.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FoodsCartComponent } from "./pages/foods-cart/foods-cart.component";
import { FormsModule } from "@angular/forms";
import { NgToastModule } from "ng-angular-popup";
import { CheckoutComponent } from "./pages/checkout/checkout.component";
import { NumberToWordsPipe } from "../share/pipes/number-to-words.pipe";
import { ImageUploadService } from "../share/service/image-upload.service";
import { AutoIdService } from "../share/service/auto-id.service";
import { WebSocketService } from "../share/service/web-socket.service";
import { RouterModule } from "@angular/router";
import { RestaurantBannersComponent } from "./pages/restaurant-banners/restaurant-banners.component";
import { RestaurantComponent } from "./pages/restaurant/restaurant.component";
import { MatExpansionModule } from "@angular/material/expansion";

@NgModule({
  declarations: [
    DefaultLayoutComponent,
    CarouselComponent,
    FoodDetailsComponent,
    FooterComponent,
    FoodsCartComponent,
    CheckoutComponent,
    NumberToWordsPipe,
    RestaurantBannersComponent,
    RestaurantComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    NgToastModule,
    RouterModule,
    MatExpansionModule,
  ],
  providers: [ImageUploadService, AutoIdService, WebSocketService],
})
export class HomeModule {}
