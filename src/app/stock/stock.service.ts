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
    return this.httpClient.post(this.url+"item", itemData);
  }

  editStockItem(itemData): Observable<any>{
    return this.httpClient.put(this.url+"item", itemData);
  }

  transfer(formData): Observable<any>{
    return this.httpClient.post(this.url+"transfer", formData);
  }

  deleteStockItem(data): Observable<any>{
    return this.httpClient.get(this.url+"deleteStockItem", {params:{ID:data}});
  }

  
}
