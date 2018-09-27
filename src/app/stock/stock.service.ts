import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private url="http://localhost/DMD-Inventory/src/assets/api/stock/";
  constructor(private httpClient: HttpClient) { }

  addStockItem(itemData): Observable<any>{
    return this.httpClient.post(this.url+"stockAcc", itemData);
  }

  editStockItem(itemData): Observable<any>{
    return this.httpClient.post(this.url+"stockAcc", itemData);
  }
  
}
