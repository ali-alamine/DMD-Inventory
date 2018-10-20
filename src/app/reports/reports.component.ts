import { Component, OnInit } from '@angular/core';
import { Router } from "../../../node_modules/@angular/router";
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("user") !== '1') {
      this.router.navigate(["login"]);
    }
    
  }

}
