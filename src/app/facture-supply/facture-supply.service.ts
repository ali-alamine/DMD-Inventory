import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SupplyService {
  private url="http://localhost/DMD-Inventory/src/assets/api/facture/";
  constructor(private httpClient: HttpClient) {}

  newSupplyInvoice(supplyData): Observable<any>{
    return this.httpClient.post(this.url+"newSupplyInvoice", supplyData);
  }
}
