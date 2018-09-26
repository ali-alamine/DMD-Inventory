import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SubscribersReportComponent } from './subscribers-report/subscribers-report.component';
import { ClientsComponent } from './clients/clients.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { SellComponent } from './sell/sell.component';
import { SupplyComponent } from './supply/supply.component';
import { InternetInvoicesComponent } from './internet-invoices/internet-invoices.component';
import { SupplyInvoicesComponent } from './supply-invoices/supply-invoices.component';
import { DrawerComponent } from './drawer/drawer.component';
import { InternetDrawerComponent } from './internet-drawer/internet-drawer.component';
import { CentralInvoicesComponent } from './central-invoices/central-invoices.component';
import { AccessoriesInvoicesComponent } from './accessories-invoices/accessories-invoices.component';
import { CreditInvoicesComponent } from './credit-invoices/credit-invoices.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccessoriesDrawerComponent } from './accessories-drawer/accessories-drawer.component';
import { MobileDrawerComponent } from './mobile-drawer/mobile-drawer.component';

const routes: Routes = [
  {
    path:"sell",component:SellComponent
  },
  {
    path:"subscribers",component:SubscribersComponent
  },
  {
    path:"stock",component:StockComponent
  },
  {
    path:"subscription",component:SubscriptionComponent
  },
  {
    path:"subscribersReport",component:SubscribersReportComponent
  },
  {
    path:"clients",component:ClientsComponent
  },
  {
    path:"suppliers",component:SuppliersComponent
  },
  {
    path:"supply",component:SupplyComponent
  },
  {
    path:"internetInvoices",component:InternetInvoicesComponent
  },
  {
    path:"accessoriesInvoices",component:AccessoriesInvoicesComponent
  },
  {
    path:"centralInvoices",component:CentralInvoicesComponent
  },
  {
    path:"creditInvoices",component:CreditInvoicesComponent
  },
  {
    path:"drawer",component:DrawerComponent,  children: [
      { path: 'internet',component:  InternetDrawerComponent},
      { path : 'accDrawer',component: AccessoriesDrawerComponent }, 
      { path : 'mobileDrawer',component: MobileDrawerComponent } 
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
