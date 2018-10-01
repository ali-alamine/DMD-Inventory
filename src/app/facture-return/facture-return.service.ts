import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureReturnService {
  private url="http://localhost/DMD-Inventory/src/assets/api/factureReturn/";
  constructor(private httpClient: HttpClient) {}

  getOrderNoConfirm():Observable<any>{
    return this.httpClient.get(this.url+"getOrderNoConfirm");
  }
  searchPerson(data,isClient):Observable<any>{
    return this.httpClient.get(this.url+"searchPerson", {params:{keyword:data,isClient:isClient}});
  } 
  searchItem(data,type):Observable<any>{
    return this.httpClient.get(this.url+"searchItem", {params:{keyword:data,type:type}});
  } 
  newReturnInvoice(invoiceData): Observable<any>{
    return this.httpClient.post(this.url+"newReturnInvoice", invoiceData);
  }
  confirmOrder(data): Observable<any>{
    console.log(data)
    return this.httpClient.get(this.url+"confirmOrder", data);
  }
  rejectOrder(ordID): Observable<any>{
    return this.httpClient.post(this.url+"rejectOrder", ordID);
  }
}