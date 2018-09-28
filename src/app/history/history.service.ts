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
  getFactureDetails(data):Observable<any>{
    // console.log(data);
    return this.httpClient.get(this.url+"getFactureDetails", {params:{ID:data}});
  }
  deleteFacture(data): Observable<any>{
    console.log(data);
    return this.httpClient.get(this.url+"deleteFacture", {params:{ID:data}});
  }
  deleteItem(data): Observable<any>{
    // console.log(data);
    return this.httpClient.get(this.url+"deleteItem", {params:{ID:data}});
  }
}
