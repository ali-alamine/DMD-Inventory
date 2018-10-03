import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { ClientsComponent } from './clients/clients.component';
import { SupplyComponent } from './facture-supply/facture-supply.component';
import { SupplyInvoicesComponent } from './supply-invoices/supply-invoices.component';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FactureComponent } from './facture/facture.component';
import { HistoryComponent } from './history/history.component';
import { HistoryItemsComponent } from './history-items/history-items.component';
import { HistoryFactureComponent } from './history-facture/history-facture.component';
import { FactureClientComponent } from './facture-client/facture-client.component';
import { FactureReturnComponent } from './facture-return/facture-return.component';
import { SettingsComponent } from './settings/settings.component';
import { HistoryReturnComponent } from './history-return/history-return.component';

const routes: Routes = [
  {
    path:"facture",component:FactureComponent, children:[
      { path: 'supply',component:  SupplyComponent},
      { path: 'return',component:  FactureReturnComponent},
      { path : 'client',component: FactureClientComponent } 
    ]
  },
  {
    path:"stock",component:StockComponent
  },
  {
    path:"settings",component:SettingsComponent
  },
  {
    path:"clients",component:ClientsComponent
  },
  {
    path:"history",component:HistoryComponent,  children: [
      { path: 'facture',component:  HistoryFactureComponent},
      { path : 'items',component: HistoryItemsComponent } ,
      { path : 'return',component: HistoryReturnComponent } 
    ]
  },
  {
    path:"",component:FactureClientComponent
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
