import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    loadChildren:() => import ('./modules/home/home.module').then((m) => m.HomeModule)
  },
  {
    path:'riders',
    loadChildren:() => import ('./modules/riders/riders.module').then((m) => m.RidersModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
