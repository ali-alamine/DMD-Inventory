import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '../../node_modules/@angular/router';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DMD-Inventory';
  currentUrl;
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        if(this.currentUrl=="/login" || this.currentUrl=="/logout")
          $("#navBar").hide();
        else
          $("#navBar").show();
      }
  });
    
    // if (localStorage.getItem("user") !== '1')
      // this.router.navigate(["login"]);
  }
  @HostListener('window:beforeunload')
  destroyLocalStorage() {
    localStorage.clear();
  }
}
