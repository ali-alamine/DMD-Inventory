import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryFactureService {

  // private url="http://localhost/MoussaNet/src/assets/api/history/";
  constructor(private httpClient: HttpClient) { }

  // getAccDrawer():Observable<any>{
  //   return this.httpClient.get(this.url+"accDrawer");
  // }
  // getFactureDetails(data):Observable<any>{
  //   return this.httpClient.get(this.url+"getFactureDetails", {params:{ID:data}});
  // }
}
