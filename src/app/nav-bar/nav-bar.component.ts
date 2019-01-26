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
  public badgeCount: any;
  badgeCount2: any;

  constructor(private router: Router,private location: Location,private navBarService:NavBarService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  ngOnInit() {
    this.navBarService.getCountFR().subscribe(Response => {
      this.badgeCount = Response[0].c;      
      this.getCountFR();
      this.navBarService.changeCount(Response[0].c);
    });

  }
  goBack(){
    this.location.back();
  }
  goForward(){
    this.location.forward();
  }
  getCountFR(){
    this.navBarService.currentCount.subscribe(Response =>
      {
        this.badgeCount = Response;
      }
       )
  }
}
