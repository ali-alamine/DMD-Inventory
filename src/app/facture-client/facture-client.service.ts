import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureClientService {

  private url="http://localhost/dmd-inventory/src/assets/api/factureClient/";
  constructor(private httpClient: HttpClient) {}

  searchClient(data):Observable<any>{
    return this.httpClient.get(this.url+"searchClient", {params:{keyword:data}});
  }  
}
