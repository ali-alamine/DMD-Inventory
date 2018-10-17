import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private url="http://localhost/DMD-Inventory/src/assets/api/facture/";
  constructor(private httpClient: HttpClient) {}

  searchClient(data):Observable<any>{
    return this.httpClient.get(this.url+"searchClient", {params:{keyword:data}});
  }
}
