import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureClientService {

  private url="http://localhost/DMD-Inventory/src/assets/api/facture/";
  constructor(private httpClient: HttpClient) {}

  searchClient(data):Observable<any>{
    return this.httpClient.get(this.url+"searchClient", {params:{keyword:data}});
  }

  newClientInvoice(invoiceData): Observable<any>{
    return this.httpClient.post(this.url+"newClientInvoice", invoiceData);
  }
  getFactureDetails(factureID):Observable<any>{
    return this.httpClient.get(this.url+"getFactureDetails", {params:{factureID:factureID}});
  }
  editClientInvoice(invoiceData): Observable<any>{
    return this.httpClient.post(this.url+"editClientInvoice", invoiceData);
  }
  addNewClient(clientData): Observable<any> {
    return this.httpClient.post("http://localhost/DMD-Inventory/src/assets/api/clients/client", clientData);
  }
  searchClientName(data):Observable<any>{
    return this.httpClient.get("http://localhost/DMD-Inventory/src/assets/api/clients/searchClientName", {params:{keyword:data}});
  }
}