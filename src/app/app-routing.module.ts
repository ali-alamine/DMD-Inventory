import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { ClientsComponent } from './clients/clients.component';
import { SellComponent } from './sell/sell.component';
import { SupplyComponent } from './supply/supply.component';
import { SupplyInvoicesComponent } from './supply-invoices/supply-invoices.component';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FactureComponent } from './facture/facture.component';

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
  // {
  //   path:"drawer",component:DrawerComponent,  children: [
  //     { path: 'internet',component:  InternetDrawerComponent},
  //     { path : 'accDrawer',component: AccessoriesDrawerComponent }, 
  //     { path : 'mobileDrawer',component: MobileDrawerComponent } 
  //   ]
  // },
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
