import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { ClientsComponent } from './clients/clients.component';
import { SellComponent } from './sell/sell.component';
import { SupplyComponent } from './supply/supply.component';
import { SupplyInvoicesComponent } from './supply-invoices/supply-invoices.component';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
<<<<<<< HEAD
import { FactureComponent } from './facture/facture.component';
=======
import { HistoryComponent } from './history/history.component';
import { HistoryItemsComponent } from './history-items/history-items.component';
import { HistoryFactureComponent } from './history-facture/history-facture.component';
>>>>>>> d17f5207b93802f8fe58574e55e4aae4f3a3f39c

const routes: Routes = [
  {
    path:"sell",component:SellComponent
  },
 
  {
    path:"stock",component:StockComponent
  },
  {
    path:"facture",component:FactureComponent
  },
  {
    path:"clients",component:ClientsComponent
  },
  
  {
    path:"supply",component:SupplyComponent
  },
  {
    path:"history",component:HistoryComponent,  children: [
      { path: 'facture',component:  HistoryFactureComponent},
      { path : 'items',component: HistoryItemsComponent } 
    ]
  },
  {
    path:"supplyInvoices",component:SupplyInvoicesComponent
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
