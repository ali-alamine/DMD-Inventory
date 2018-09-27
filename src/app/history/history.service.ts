import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';

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
    // debugger
    console.log(data);
    return this.httpClient.get(this.url+"getFactureDetails", {params:{ID:data}});
  }
}
