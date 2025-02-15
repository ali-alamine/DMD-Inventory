import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
@Injectable({
  providedIn: "root"
})
export class ClientsService {
  private url = "http://localhost/DMD-Inventory/src/assets/api/clients/";

  constructor(private httpClient: HttpClient) {}

  addNewClient(clientData): Observable<any> {
    return this.httpClient.post(this.url + "client", clientData);
  }

  editClient(clientData): Observable<any> {
    // console.log(clientData)
    return this.httpClient.put(this.url + "client", clientData);
  }

  searchClientName(data): Observable<any> {
    return this.httpClient.get(this.url + "searchClientName", {
      params: { keyword: data }
    });
  }

  deleteClient(data): Observable<any> {
    return this.httpClient.get(this.url + "deleteClient",{params:{ID:data}});
  }

  getAllClient(): Observable<any> {
    return this.httpClient.get(this.url + "getAllClient");
  }
}
