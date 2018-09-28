import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureReturnService {
  private url="http://localhost/DMD-Inventory/src/assets/api/supply/";
  constructor(private httpClient: HttpClient) {}

  searchPerson(data,isClient):Observable<any>{
    return this.httpClient.get(this.url+"searchPerson", {params:{keyword:data,isClient:isClient}});
  } 
  searchItem(data,type):Observable<any>{
    return this.httpClient.get(this.url+"searchItem", {params:{keyword:data,type:type}});
  } 
  addSupply(supplyData): Observable<any>{
    console.log(supplyData)
    return this.httpClient.post(this.url+"addSupply", supplyData);
  }
}