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
import {ChartModule} from 'primeng/chart';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StockComponent } from './stock/stock.component';
import { ClientsComponent } from './clients/clients.component';
import { SupplyComponent } from './facture-supply/facture-supply.component';
import {MatIconModule} from '@angular/material/icon';
import { SupplyInvoicesComponent } from './supply-invoices/supply-invoices.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FocusDirectiveDirective } from './focus-directive.directive';
import { FactureComponent } from './facture/facture.component';
import { HistoryFactureComponent } from './history-facture/history-facture.component';
import { HistoryItemsComponent } from './history-items/history-items.component';
import { HistoryComponent } from './history/history.component';
import { FactureClientComponent } from './facture-client/facture-client.component';
import { FactureReturnComponent } from './facture-return/facture-return.component';
import {HotkeyModule} from 'angular2-hotkeys';
import { SettingsComponent } from './settings/settings.component';
import { FileUploadModule } from 'primeng/components/fileupload/fileupload';
import {MatBadgeModule} from '@angular/material/badge';
import { HistoryReturnComponent } from './history-return/history-return.component';
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    StockComponent,
    ClientsComponent,
    SupplyComponent,
    SupplyInvoicesComponent,
    PageNotFoundComponent,
    FocusDirectiveDirective,
    FactureComponent,
    HistoryComponent,
    HistoryFactureComponent,
    HistoryItemsComponent,
    FactureClientComponent,
    FactureReturnComponent,
    SettingsComponent,
    HistoryReturnComponent
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
    HotkeyModule.forRoot(),
    FileUploadModule,
    MatBadgeModule
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
