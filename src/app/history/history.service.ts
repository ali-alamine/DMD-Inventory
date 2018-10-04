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
  getFactureReturnDetails(ID):Observable<any>{
    return this.httpClient.get(this.url+"getFactureReturnDetails", {params:{ID:ID}});
  }
  deleteFacture(invID,type): Observable<any>{
    return this.httpClient.get(this.url+"deleteFacture", {params:{invID:invID,type:type}});
  }
  deleteItem(ordID,type): Observable<any>{
    return this.httpClient.get(this.url+"deleteItem", {params:{ordID:ordID,type:type}});
  }
  confirmOrder(data): Observable<any>{
    return this.httpClient.post(this.url+"confirmOrder",data);

  }
  rejectOrder(ordID,invID): Observable<any>{
    return this.httpClient.get(this.url+"rejectOrder",  {params:{ordID:ordID,invID:invID}});
  }
  confirmAll(invID): Observable<any>{
    return this.httpClient.get(this.url+"confirmAll",{params:{invID:invID}});

  }
  rejectAll(invID): Observable<any>{
    return this.httpClient.get(this.url+"rejectAll",  {params:{invID:invID}});
  }
}
