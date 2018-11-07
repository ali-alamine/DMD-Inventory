import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavBarService {
  static url="http://localhost/DMD-Inventory/src/assets/api/navBar/";
  static httpClient: HttpClient;
  constructor() { }

  static getCountFR(): Observable<any>{
    return NavBarService.httpClient.get(this.url+"getCountFR");
  }
}
