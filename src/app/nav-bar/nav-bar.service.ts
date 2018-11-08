import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class NavBarService {
  private url = "http://localhost/DMD-Inventory/src/assets/api/navBar/";

  private countSource = new BehaviorSubject<string>("0");
  currentCount = this.countSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  public getCountFR(): Observable<any> {
    return this.httpClient.get(this.url + "getCountFR");
  }

  /* count notification */
  changeCount(count:string) {
    this.countSource.next(count);
  }
}
