import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private url="http://localhost/MoussaNet/src/assets/api/subscriber/";
  constructor(private httpClient: HttpClient) { }

  togglePayment(data):Observable<any>{
    const myObj = {
      id: data
    };
    const myObjStr = JSON.stringify(myObj);
    
    return this.httpClient.put(this.url+"setUnsetPayment",JSON.parse(myObjStr));
  }

  deleteSubscription(data):Observable<any>{
    const myObj = {
      id: data
    };
    const myObjStr = JSON.stringify(myObj);    
    return this.httpClient.put(this.url+"deleteSubscription",JSON.parse(myObjStr));
  }
}
