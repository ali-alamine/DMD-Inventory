import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { ClientsComponent } from './clients/clients.component';
import { SellComponent } from './sell/sell.component';
import { SupplyComponent } from './supply/supply.component';
import { SupplyInvoicesComponent } from './supply-invoices/supply-invoices.component';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FactureComponent } from './facture/facture.component';
import { HistoryComponent } from './history/history.component';
import { HistoryItemsComponent } from './history-items/history-items.component';
import { HistoryFactureComponent } from './history-facture/history-facture.component';

const routes: Routes = [
  {
    path:"sell",component:SellComponent, children:[
      { path: 'supply',component:  SupplyComponent},
      { path: 'return',component:  PageNotFoundComponent},
      { path : 'facture',component: FactureComponent } 
    ]
  },
  {
    path:"stock",component:StockComponent
  },
  {
    path:"clients",component:ClientsComponent
  },
  {
    path:"history",component:HistoryComponent,  children: [
      { path: 'facture',component:  HistoryFactureComponent},
      { path : 'items',component: HistoryItemsComponent } 
    ]
  },
  {
    path:"",component:SellComponent
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
