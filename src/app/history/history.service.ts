import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private url="http://localhost/DMD-Inventory/src/assets/api/history/";
  constructor(private httpClient: HttpClient) { }

  // getAccDrawer():Observable<any>{
  //   return this.httpClient.get(this.url+"accDrawer");
  // }
  getFactureDetails(ID,type):Observable<any>{
    return this.httpClient.get(this.url+"getFactureDetails", {params:{ID:ID,type:type}});
  }
  deleteFacture(ID,type): Observable<any>{
    return this.httpClient.get(this.url+"deleteFacture", {params:{ID:ID,type:type}});
  }
  deleteItem(data): Observable<any>{
    return this.httpClient.get(this.url+"deleteItem", {params:{ID:data}});
  }
}
