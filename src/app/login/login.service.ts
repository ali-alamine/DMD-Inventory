import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private httpClient: HttpClient) { }

  getConnection(data): Observable<any>{
    return this.httpClient.post("http://localhost/DMD-Inventory/src/assets/api/login/getConnection",data);
  }
}
