import { Injectable } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { HttpClient } from '../../../node_modules/@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HistoryReturnService {
  private url="http://localhost/DMD-Inventory/src/assets/api/history/";
  constructor(private httpClient: HttpClient) {}
  getOrderNoConfirm():Observable<any>{
    return this.httpClient.get(this.url+"getOrderNoConfirm");
  }
}
