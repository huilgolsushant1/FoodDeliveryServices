import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RidersRoutingModule } from './riders-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OrdersComponent } from './pages/orders/orders.component';
import { TextTransformPipe } from '../share/pipes/text-transform.pipe';
import { RidersComponent } from './pages/orders/riders/riders/riders.component';


@NgModule({
  declarations: [
    OrdersComponent,
    TextTransformPipe,
    RidersComponent
  ],
  imports: [
    CommonModule,
    RidersRoutingModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule
  ],
  providers: []
})
export class RidersModule { }
