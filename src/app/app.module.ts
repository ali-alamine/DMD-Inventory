import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { MatNativeDateModule, MatAutocompleteModule, MatSnackBarModule, MatBottomSheetModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StockComponent } from './stock/stock.component';
import { ClientsComponent } from './clients/clients.component';
import { SupplyComponent } from './facture-supply/facture-supply.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FocusDirectiveDirective } from './focus-directive.directive';
import { FactureComponent } from './facture/facture.component';
import { HistoryFactureComponent } from './history-facture/history-facture.component';
import { HistoryItemsComponent } from './history-items/history-items.component';
import { HistoryComponent } from './history/history.component';
import { FactureClientComponent } from './facture-client/facture-client.component';
import { FactureReturnComponent } from './facture-return/facture-return.component';
import {HotkeyModule} from 'angular2-hotkeys';
import {DatePipe} from '@angular/common';

import { SettingsComponent } from './settings/settings.component';
import { HistoryReturnComponent } from './history-return/history-return.component';
import { HistoryTransferComponent } from './history-transfer/history-transfer.component';
import { LoginComponent } from './login/login.component';
import { ReportsComponent } from './reports/reports.component';
import { ReportsClientComponent } from './reports-client/reports-client.component';
import { ReportsStockComponent } from './reports-stock/reports-stock.component';
import { ReportsInvoiceComponent } from './reports-invoice/reports-invoice.component';
import { ReportsInvoiceItemsComponent } from './reports-invoice-items/reports-invoice-items.component';

import {MultiSelectModule} from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/components/fileupload/fileupload';
import {ChartModule} from 'primeng/chart';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    StockComponent,
    ClientsComponent,
    SupplyComponent,
    PageNotFoundComponent,
    FocusDirectiveDirective,
    FactureComponent,
    HistoryComponent,
    HistoryFactureComponent,
    HistoryItemsComponent,
    FactureClientComponent,
    FactureReturnComponent,
    SettingsComponent,
    HistoryReturnComponent,
    HistoryTransferComponent,LoginComponent, ReportsComponent, ReportsClientComponent, ReportsStockComponent, ReportsInvoiceComponent, ReportsInvoiceItemsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ContextMenuModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule,
    NgxSpinnerModule,
    MatButtonToggleModule,
    ChartModule,
    MatRadioModule,
    HotkeyModule.forRoot(),
    FileUploadModule,
    MatBadgeModule,
    MatMenuModule,
    MultiSelectModule
  ],
  entryComponents: [],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
