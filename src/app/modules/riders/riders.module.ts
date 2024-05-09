import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RidersRoutingModule } from './riders-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OrdersComponent } from './pages/orders/orders.component';
import { TextTransformPipe } from '../share/pipes/text-transform.pipe';
import { RidersListComponent } from './pages/orders/riders-list/riders-list.component';


@NgModule({
  declarations: [
    OrdersComponent,
    TextTransformPipe,
    RidersListComponent
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
