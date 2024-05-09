import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './pages/orders/orders.component';
import { RidersComponent } from './pages/riders/riders/riders.component';

const routes: Routes = [
  {
    path:':id',
    component:OrdersComponent
  },
  {
    path:'',
    component:RidersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RidersRoutingModule { }
