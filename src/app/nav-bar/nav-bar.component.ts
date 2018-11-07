import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { NavBarService } from './nav-bar.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  currentUrl: string;
  static badgeCount: number;

  constructor(private router: Router,private location: Location) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  ngOnInit() {
    NavBarComponent.getCountFR();

  }
  goBack(){
    this.location.back();
  }
  goForward(){
    this.location.forward();
  }
  static getCountFR(){
    NavBarService.getCountFR().subscribe(Response => {
      NavBarComponent.badgeCount=Response[0].c;
    });
  }
}
