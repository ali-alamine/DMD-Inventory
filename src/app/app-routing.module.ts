import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { SellComponent } from './sell/sell.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  {
    path:"sell",component:SellComponent
  },
  {
    path:"stock",component:StockComponent
  },
  {
    path:"history",component:HistoryComponent
  },
  {
    path:"",component:StockComponent
  },
  {
    path:"**",component:PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
