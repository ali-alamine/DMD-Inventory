import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { StockComponent } from './stock/stock.component';
import { ClientsComponent } from './clients/clients.component';
import { SupplyComponent } from './supply/supply.component';
import { SellComponent } from './sell/sell.component';
import { HistoryComponent } from './history/history.component';


// import {  APP_INITIALIZER } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FocusDirectiveDirective } from './focus-directive.directive';

// export function init_app(firstLoadService: ApploadService ) {
//   return () => firstLoadService.autoSubscription();
// }

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    StockComponent,
    ClientsComponent,
    SupplyComponent,
    SellComponent,
    PageNotFoundComponent,
    FocusDirectiveDirective,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  entryComponents: [],
  // providers: [ ApploadService,
  //   { provide: APP_INITIALIZER, useFactory: init_app, deps: [ApploadService], multi: true }],
  // bootstrap: [AppComponent]
})
export class AppModule { }
